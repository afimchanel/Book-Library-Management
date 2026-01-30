import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiCreatedResponse,
  ApiReadResponses,
} from 'src/common/decorators/api-responses.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ApiResponseExamples } from 'src/common/examples/api-response.examples';
import { AuthenticatedUser } from 'src/auth/auth.interface';
import { BookDetailDtoResponse, BookListItemDtoResponse } from './dto/book.dto';
import { BorrowRecordDetailDtoResponse } from './dto/borrow-record.dto';

const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

const storage = diskStorage({
  destination: './uploads/covers',
  filename: (req, file, callback) => {
    const uniqueName = `${uuid()}${extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});

@ApiTags('Books')
@ApiBearerAuth('JWT-auth')
@Controller('books')
@UseGuards(JwtAuthGuard)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiCreatedResponse({
    description: 'Book created successfully',
    type: BookDetailDtoResponse,
    success: {
      success: {
        value: ApiResponseExamples.bookDetail,
      },
    },
  })
  async create(@Body() createBookDto: CreateBookDto) {
    return await this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books with pagination and search' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search in title, author, ISBN',
  })
  @ApiReadResponses({
    description: 'List of books retrieved successfully',
    type: BookListItemDtoResponse,
    success: {
      success: {
        value: ApiResponseExamples.paginatedBooks,
      },
    },
  })
  async findAll(@Query() searchDto: SearchBookDto) {
    return await this.booksService.findAll(searchDto);
  }

  @Get('user/borrowed')
  @ApiOperation({ summary: 'Get current user borrowed books' })
  @ApiReadResponses({
    description: 'List of borrowed books retrieved successfully',
    type: BorrowRecordDetailDtoResponse,
  })
  async getUserBorrowedBooks(@CurrentUser() user: AuthenticatedUser) {
    return await this.booksService.getUserBorrowedBooks(user.id);
  }

  @Get('user/history')
  @ApiOperation({ summary: 'Get current user borrow history' })
  @ApiReadResponses({
    description: 'Borrow history retrieved successfully',
    type: BorrowRecordDetailDtoResponse,
  })
  async getUserBorrowHistory(@CurrentUser() user: AuthenticatedUser) {
    return await this.booksService.getUserBorrowHistory(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID' })
  @ApiParam({ name: 'id', description: 'Book UUID' })
  @ApiReadResponses({
    description: 'Book details retrieved successfully',
    type: BookDetailDtoResponse,
    success: {
      success: {
        value: ApiResponseExamples.bookDetail,
      },
    },
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.booksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book' })
  @ApiParam({ name: 'id', description: 'Book UUID' })
  @ApiReadResponses({
    description: 'Book updated successfully',
    type: BookDetailDtoResponse,
    success: {
      success: {
        value: ApiResponseExamples.bookDetail,
      },
    },
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return await this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book (soft delete)' })
  @ApiParam({ name: 'id', description: 'Book UUID' })
  @ApiReadResponses({
    description: 'Book deleted successfully',
    type: BookDetailDtoResponse,
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.booksService.remove(id);
  }

  @Post(':id/cover')
  @ApiOperation({ summary: 'Upload book cover image' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Book UUID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cover: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiReadResponses({
    description: 'Cover uploaded successfully',
    type: BookDetailDtoResponse,
  })
  @UseInterceptors(
    FileInterceptor('cover', {
      storage,
      fileFilter: imageFileFilter,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadCover(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.booksService.updateCoverImage(
      id,
      `/uploads/covers/${file.filename}`,
    );
  }

  @Post(':id/borrow')
  @ApiOperation({ summary: 'Borrow a book' })
  @ApiParam({ name: 'id', description: 'Book UUID' })
  @ApiReadResponses({
    description: 'Book borrowed successfully',
    type: BorrowRecordDetailDtoResponse,
    success: {
      success: {
        value: ApiResponseExamples.borrowRecordDetail,
      },
    },
  })
  async borrowBook(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.booksService.borrowBook(id, user.id);
  }

  @Post(':id/return')
  @ApiOperation({ summary: 'Return a borrowed book' })
  @ApiParam({ name: 'id', description: 'Book UUID' })
  @ApiReadResponses({
    description: 'Book returned successfully',
    type: BorrowRecordDetailDtoResponse,
  })
  async returnBook(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return await this.booksService.returnBook(id, user.id);
  }
}

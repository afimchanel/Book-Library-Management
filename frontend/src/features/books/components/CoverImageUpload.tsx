import { useCoverImageUpload } from "@/features/books/hooks";
import { X, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib";

interface CoverImageUploadProps {
  bookId: string;
  currentCoverUrl?: string;
  onUploadSuccess?: (coverUrl: string) => void;
}

export function CoverImageUpload({
  bookId,
  currentCoverUrl,
  onUploadSuccess,
}: CoverImageUploadProps) {
  const {
    fileInputRef,
    dragActive,
    displayImage,
    uploadMutation,
    handleInputChange,
    handleDrag,
    handleDrop,
    clearPreview,
  } = useCoverImageUpload({
    bookId,
    currentCoverUrl,
    onUploadSuccess,
  });

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Cover Image
      </label>

      {displayImage ? (
        <div className="relative inline-block">
          <img
            src={displayImage}
            alt="Book cover"
            className="w-32 h-48 object-cover rounded-lg shadow-md"
          />
          {!uploadMutation.isPending && (
            <button
              type="button"
              onClick={clearPreview}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {uploadMutation.isPending && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
            "hover:border-blue-400 hover:bg-blue-50",
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
          )}
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-3 bg-gray-100 rounded-full mb-3">
              <ImageIcon className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium text-blue-600">Click to upload</span>{" "}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF, WEBP up to 5MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {uploadMutation.isError && (
        <p className="text-sm text-red-600">
          Failed to upload cover image. Please try again.
        </p>
      )}

      {uploadMutation.isSuccess && (
        <p className="text-sm text-green-600">
          Cover image uploaded successfully!
        </p>
      )}
    </div>
  );
}

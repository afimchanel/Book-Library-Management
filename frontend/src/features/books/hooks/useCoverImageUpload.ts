import { useState, useRef, useCallback } from "react";
import { bookRepository } from "../repositories";

/**
 * Reusable hook สำหรับ upload รูป cover
 * ใช้ได้กับทุก component ที่ต้องการ upload cover image
 */

interface UseCoverImageUploadOptions {
  bookId: string;
  currentCoverUrl?: string;
  onUploadSuccess?: (coverUrl: string) => void;
}

export function useCoverImageUpload({
  bookId,
  currentCoverUrl,
  onUploadSuccess,
}: UseCoverImageUploadOptions) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [coverRemoved, setCoverRemoved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = bookRepository.useUploadCover();

  const handleSuccess = (coverUrl: string) => {
    setPreview(null);
    setCoverRemoved(false);
    onUploadSuccess?.(coverUrl);
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      uploadMutation.mutate(
        { bookId, file },
        {
          onSuccess: (book) => handleSuccess(book.coverImage || ""),
        }
      );
    },
    [bookId, uploadMutation]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setCoverRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayImage =
    preview || (!coverRemoved && currentCoverUrl ? currentCoverUrl : null);

  return {
    fileInputRef,
    dragActive,
    displayImage,
    uploadMutation,
    handleInputChange,
    handleDrag,
    handleDrop,
    clearPreview,
  };
}

import { useState, useRef } from "react";
import { Button } from "./button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  currentImage?: string;
  onImageUploaded: (imageUrl: string) => void;
  label?: string;
}

const ImageUpload = ({ 
  currentImage, 
  onImageUploaded,
  label = "Upload Image" 
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error uploading image");
      }
      
      const data = await response.json();
      
      // Set preview
      setPreview(data.url);
      
      // Call callback with URL
      onImageUploaded(data.url);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.match(/image\/(jpeg|jpg|png|gif|webp)/i)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a valid image file (JPEG, PNG, GIF, or WEBP)",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Image must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Create a preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Upload file
      handleUpload(file);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      
      <div className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 transition-all hover:border-primary dark:hover:border-accent cursor-pointer" 
        onClick={handleButtonClick}
      >
        {preview ? (
          <div className="relative w-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="rounded-md max-h-44 mx-auto object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity rounded-md">
              <span className="text-white text-sm">Click to change</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="fas fa-cloud-upload-alt text-2xl mb-2 text-gray-400"></i>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">JPG, PNG, GIF, WEBP up to 5MB</p>
          </div>
        )}
      </div>
      
      {uploading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary dark:border-accent"></div>
          <span className="ml-2 text-sm text-gray-500">Uploading...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 
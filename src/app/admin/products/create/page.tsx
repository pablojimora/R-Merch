// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import Link from "next/link";
// import Image from "next/image";

// export default function CreateProductPage() {
//   return (
//     <ProtectedRoute requireAdmin={true}>
//       <CreateProductContent />
//     </ProtectedRoute>
//   );
// }

// function CreateProductContent() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     stock: "",
//     images: [] as string[],
//   });
//   const [error, setError] = useState<string | null>(null);

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     setUploadingImage(true);
//     setError(null);

//     try {
//       const uploadedUrls: string[] = [];

//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const formDataUpload = new FormData();
//         formDataUpload.append("file", file);

//         const res = await fetch("/api/upload", {
//           method: "POST",
//           body: formDataUpload,
//         });

//         const data = await res.json();

//         if (data.success) {
//           uploadedUrls.push(data.data.url);
//         } else {
//           throw new Error(data.message || "Error al subir imagen");
//         }
//       }

//       setFormData({ ...formData, images: [...formData.images, ...uploadedUrls] });
//     } catch (error: any) {
//       console.error("Error uploading images:", error);
//       setError(error.message || "Error al subir imágenes");
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const handleRemoveImage = (index: number) => {
//     const newImages = formData.images.filter((_, i) => i !== index);
//     setFormData({ ...formData, images: newImages });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     // Validations
//     if (!formData.name || !formData.price || !formData.stock) {
//       setError("Por favor completa todos los campos requeridos");
//       setLoading(false);
//       return;
//     }

//     if (formData.images.length === 0) {
//       setError("Debes subir al menos una imagen del producto");
//       setLoading(false);
//       return;
//     }

//     const price = parseFloat(formData.price);
//     const stock = parseInt(formData.stock);

//     if (isNaN(price) || price <= 0) {
//       setError("El precio debe ser un número mayor a 0");
//       setLoading(false);
//       return;
//     }

//     if (isNaN(stock) || stock < 0) {
//       setError("El stock debe ser un número mayor o igual a 0");
//       setLoading(false);
//       return;
//     }

//     try {
//       const payload = {
//         name: formData.name,
//         description: formData.description,
//         price,
//         stock,
//         images: formData.images,
//       };

//       const res = await fetch("/api/products", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("Producto creado exitosamente");
//         router.push("/admin/products/list");
//       } else {
//         setError(data.message || "Error al crear producto");
//       }
//     } catch (error) {
//       console.error("Error creating product:", error);
//       setError("Error al crear producto");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddImageField = () => {
//     setFormData({ ...formData, images: [...formData.images, ""] });
//   };

//   const handleRemoveImageField = (index: number) => {
//     const newImages = formData.images.filter((_, i) => i !== index);
//     setFormData({ ...formData, images: newImages.length > 0 ? newImages : [""] });
//   };

//   const handleImageChange = (index: number, value: string) => {
//     const newImages = [...formData.images];
//     newImages[index] = value;
//     setFormData({ ...formData, images: newImages });
//   };

//   return (
//     <div className="py-8 max-w-3xl mx-auto">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-[#161C40]">Crear Producto</h1>
//         <p className="mt-2 text-gray-600">Agrega un nuevo producto al catálogo</p>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6">
//         {error && (
//           <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
//             <div className="flex gap-3">
//               <svg className="h-5 w-5 text-red-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <p className="text-sm text-red-800">{error}</p>
//             </div>
//           </div>
//         )}

//         <div className="space-y-6">
//           {/* Name */}
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//               Nombre <span className="text-red-600">*</span>
//             </label>
//             <input
//               type="text"
//               id="name"
//               required
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20"
//               placeholder="Ej: Camiseta RIWI"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//               Descripción
//             </label>
//             <textarea
//               id="description"
//               rows={4}
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//               className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20"
//               placeholder="Describe el producto..."
//             />
//           </div>

//           {/* Price and Stock */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
//                 Precio (COP) <span className="text-red-600">*</span>
//               </label>
//               <div className="relative">
//                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
//                 <input
//                   type="number"
//                   id="price"
//                   required
//                   step="1"
//                   min="0"
//                   value={formData.price}
//                   onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                   className="w-full rounded-md border border-gray-300 px-4 py-3 pl-8 focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20"
//                   placeholder="Ej: 50000"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
//                 Stock <span className="text-red-600">*</span>
//               </label>
//               <input
//                 type="number"
//                 id="stock"
//                 required
//                 min="0"
//                 value={formData.stock}
//                 onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
//                 className="w-full rounded-md border border-gray-300 px-4 py-3 focus:border-[#615CF2] focus:outline-none focus:ring-2 focus:ring-[#615CF2]/20"
//                 placeholder="0"
//               />
//             </div>
//           </div>

//           {/* Images Upload */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Imágenes del Producto <span className="text-red-600">*</span>
//             </label>
            
//             {/* Upload Button */}
//             <div className="mb-4">
//               <label 
//                 htmlFor="imageUpload" 
//                 className={`inline-flex items-center gap-2 px-4 py-3 rounded-md border-2 border-dashed border-gray-300 hover:border-[#615CF2] cursor-pointer transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
//               >
//                 <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <span className="text-sm font-medium text-gray-700">
//                   {uploadingImage ? "Subiendo..." : "Seleccionar imágenes"}
//                 </span>
//               </label>
//               <input
//                 id="imageUpload"
//                 type="file"
//                 accept="image/jpeg,image/jpg,image/png,image/webp"
//                 multiple
//                 onChange={handleImageUpload}
//                 disabled={uploadingImage}
//                 className="hidden"
//               />
//               <p className="mt-2 text-xs text-gray-500">
//                 Formatos: JPG, JPEG, PNG, WEBP. Máximo 5MB por imagen.
//               </p>
//             </div>

//             {/* Image Preview Grid */}
//             {formData.images.length > 0 && (
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {formData.images.map((img, index) => (
//                   <div key={index} className="relative group">
//                     <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
//                       <Image
//                         src={img}
//                         alt={`Imagen ${index + 1}`}
//                         width={200}
//                         height={200}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveImage(index)}
//                       className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
//                     >
//                       <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="mt-8 flex gap-3">
//           <button
//             type="submit"
//             disabled={loading}
//             className="flex-1 rounded-md bg-[#615CF2] px-6 py-3 text-white font-semibold hover:bg-[#4e49d9] disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? "Creando..." : "Crear Producto"}
//           </button>
//           <Link
//             href="/admin/products/list"
//             className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50"
//           >
//             Cancelar
//           </Link>
//         </div>
//       </form>

//       {/* Info */}
//       <div className="mt-6 rounded-md bg-blue-50 border border-blue-200 p-4">
//         <div className="flex gap-3">
//           <svg className="h-5 w-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <div className="text-sm text-blue-800">
//             <p className="font-medium mb-1">Consejos para crear productos:</p>
//             <ul className="list-disc list-inside space-y-1 text-blue-700">
//               <li>Las imágenes se suben automáticamente a Cloudinary</li>
//               <li>Puedes seleccionar múltiples imágenes a la vez</li>
//               <li>El nombre debe ser claro y descriptivo</li>
//               <li>Agrega una descripción detallada para mejorar las ventas</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

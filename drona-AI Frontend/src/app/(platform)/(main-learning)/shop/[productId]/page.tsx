"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { shopProducts } from "@/lib/data/shop";
import { useNotifications } from "@/context/NotificationContext";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addNotification } = useNotifications();
  
  const productId = params.productId as string;
  const product = shopProducts.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button onClick={() => router.push('/shop')} className="text-[#c9a84c] hover:underline">
          Return to Marketplace
        </button>
      </div>
    );
  }

  const handleAction = (action: string) => {
    addNotification({
      title: "Insufficient Knowledge Credits",
      message: `You do not have enough KC to ${action} the ${product.name}. Complete missions to earn more!`,
      type: "alert",
    });
  };

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-8 animate-fadeIn relative">
      
      {/* Back Navigation */}
      <Link href="/shop" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-[#c9a84c] transition-colors mb-8 font-medium">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Marketplace
      </Link>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: Image Gallery */}
        <div className="w-full lg:w-5/12 shrink-0">
          <div className="bg-white border border-outline-variant/30 rounded-[2rem] p-8 aspect-square relative shadow-sm flex items-center justify-center group overflow-hidden">
             {product.image.startsWith('icon:') ? (
                <div className="w-full h-full bg-gradient-to-br from-surface-container-lowest to-surface-container flex items-center justify-center rounded-[2rem]">
                  <span className="material-symbols-outlined text-[120px] text-[#c9a84c] drop-shadow-lg">
                    {product.image.split(':')[1]}
                  </span>
                </div>
             ) : (
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover rounded-[1.5rem] group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)]" 
                />
             )}
             <div className="absolute top-6 left-6 z-10 bg-surface-container-high/90 backdrop-blur text-on-surface text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-outline-variant/20 shadow-sm">
                {product.tier}
             </div>
             {/* Image Zoom Hint */}
             <div className="absolute bottom-6 right-6 z-10 bg-black/50 text-white backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                <span className="text-xs font-bold uppercase tracking-wider">Hover to Zoom</span>
             </div>
          </div>
        </div>

        {/* Middle Column: Product Details */}
        <div className="w-full lg:w-4/12 flex flex-col pt-2">
           <h1 className="font-display font-black text-4xl text-on-surface mb-3 leading-tight">{product.name}</h1>
           
           <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-[#c9a84c]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]">
                    {i < Math.floor(product.rating) ? 'star' : i < product.rating ? 'star_half' : 'star_border'}
                  </span>
                ))}
              </div>
              <span className="text-sm font-bold text-[#c9a84c]">{product.rating}</span>
              <span className="text-sm text-on-surface-variant font-medium hover:text-[#c9a84c] cursor-pointer transition-colors">
                {product.reviews} ratings
              </span>
           </div>

           <div className="w-full h-px bg-outline-variant/30 mb-6" />

           <p className="text-on-surface-variant text-base leading-relaxed mb-8">
             {product.fullDescription}
           </p>

           <h3 className="font-bold text-lg text-on-surface mb-4">Technical Specifications</h3>
           <ul className="flex flex-col gap-3 mb-8">
             {product.features.map((feature, i) => (
               <li key={i} className="flex items-start gap-3">
                 <span className="material-symbols-outlined text-[#c9a84c] text-[20px] shrink-0 mt-0.5">check_circle</span>
                 <span className="text-on-surface-variant text-sm font-medium">{feature}</span>
               </li>
             ))}
           </ul>
        </div>

        {/* Right Column: Buy Box */}
        <div className="w-full lg:w-3/12 shrink-0">
           <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#c9a84c] text-[28px]">monetization_on</span>
                <span className="font-display font-black text-3xl text-on-surface">{product.price.toLocaleString()} KC</span>
              </div>
              
              {product.locked ? (
                 <div className="flex items-center gap-2 text-error mb-6 mt-4">
                   <span className="material-symbols-outlined text-[20px]">lock</span>
                   <span className="font-bold text-sm">Unlocks at Level {product.unlockLevel}</span>
                 </div>
              ) : (
                 <div className="flex items-center gap-2 text-primary mb-6 mt-4">
                   <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                   <span className="font-bold text-sm">In Stock - Ready to Ship</span>
                 </div>
              )}

              <div className="flex flex-col gap-3 mb-6">
                <button 
                  onClick={() => handleAction('add to cart')}
                  disabled={product.locked}
                  className={`w-full py-3.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
                    product.locked 
                      ? 'bg-surface-container-highest text-outline cursor-not-allowed' 
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                  Add to Cart
                </button>
                <button 
                  onClick={() => handleAction('purchase')}
                  disabled={product.locked}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                    product.locked 
                      ? 'bg-surface-container-highest text-outline cursor-not-allowed shadow-none' 
                      : 'bg-[#c9a84c] hover:bg-[#b09038] text-white shadow-[#c9a84c]/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  Buy Now
                </button>
              </div>

              <div className="w-full h-px bg-outline-variant/30 mb-4" />

              <div className="flex flex-col gap-3 text-xs text-on-surface-variant font-medium">
                <div className="flex items-center justify-between">
                  <span>Ships from</span>
                  <span className="text-on-surface font-bold">Drona AI Fulfillment</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sold by</span>
                  <span className="text-[#c9a84c] font-bold">Elite Exchange</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Returns</span>
                  <span className="text-on-surface font-bold">30-day refund policy</span>
                </div>
              </div>

           </div>
        </div>

      </div>
    </main>
  );
}

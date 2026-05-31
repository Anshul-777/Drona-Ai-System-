"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useNotifications } from "@/context/NotificationContext";
import { shopProducts } from "@/lib/data/shop";
import { storageAdapter } from "@/lib/storageAdapter";

export default function ShopPage() {
  const { addNotification } = useNotifications();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [userCoins, setUserCoins] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [xpProgressPct, setXpProgressPct] = useState(0);

  const fetchBalance = async () => {
    try {
      const data = await storageAdapter.getProfileDashboardData();
      if (data && data.profile) {
        setUserLevel(data.profile.level);
        
        const kcString = data.profile.kc || "0 KC";
        const numericCoins = parseInt(kcString.replace(/[^\d]/g, ""), 10) || 0;
        setUserCoins(numericCoins);

        const xpCurrent = data.profile.xp || 0;
        const xpMax = data.profile.xpMax || 1000;
        setXpProgressPct(Math.min(100, Math.floor((xpCurrent / xpMax) * 100)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBalance();
    window.addEventListener("drona_profile_updated", fetchBalance);
    return () => window.removeEventListener("drona_profile_updated", fetchBalance);
  }, []);

  const categories = ["All", "Featured", "Technology", "Essential Gear", "Boosters"];

  const filteredProducts = shopProducts.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory || (activeCategory === "Featured" && (p.tier === "Legendary" || p.tier === "Epic"));
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAction = (e: React.MouseEvent, action: string, itemName: string) => {
    e.preventDefault();
    e.stopPropagation();
    addNotification({
      title: "Insufficient Knowledge Credits",
      message: `You do not have enough KC to ${action} the ${itemName}. Complete missions and tests to earn more!`,
      type: "alert",
    });
  };

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <main className="w-full max-w-[1600px] mx-auto px-6 lg:px-8 py-6 animate-fadeIn relative overflow-x-hidden">
      
      {/* Top Header & Minimal Balance Widget */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-outline-variant/30 pb-6">
        
        {/* Left: Titles */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-[16px] text-[#c9a84c]">workspace_premium</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a84c]">Armory</span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-on-surface tracking-tight">Marketplace</h1>
        </div>

        {/* Right: Minimal Balance Widget */}
        <div className="flex items-center gap-6 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-5 py-3 shadow-sm">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-[#c9a84c] uppercase tracking-wider mb-0.5">Balance</span>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-black text-2xl text-on-surface leading-none tracking-tighter">{userCoins.toLocaleString()}</span>
              <span className="font-bold text-[#c9a84c] text-sm leading-none">KC</span>
            </div>
          </div>
          <div className="w-px h-8 bg-outline-variant/30" />
          <div className="flex flex-col items-start min-w-[120px] text-left">
             <div className="flex justify-between w-full text-[10px] font-bold uppercase tracking-wider mb-1.5">
                <span className="text-outline-variant">Elite Rank (Lvl {userLevel})</span>
                <span className="text-[#c9a84c]">{xpProgressPct}%</span>
             </div>
             <div className="w-full h-1.5 bg-surface-variant/50 rounded-full overflow-hidden">
                <div className="h-full bg-[#c9a84c] rounded-full transition-all duration-500" style={{ width: `${xpProgressPct}%` }} />
             </div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Categories */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        
        {/* Search */}
        <div className="relative w-full md:w-80 shrink-0">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Search elite gear..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-lowest border border-outline-variant/40 text-sm font-medium text-on-surface pl-11 pr-4 py-3 rounded-full focus:outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c]/50 transition-all placeholder:text-outline-variant"
          />
        </div>

        {/* Categories (Sort/Filter) */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setExpandedId(null); }}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                activeCategory === cat 
                  ? "bg-[#c9a84c] text-white border-[#c9a84c] shadow-sm shadow-[#c9a84c]/20" 
                  : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:border-[#c9a84c]/50 hover:text-on-surface"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 items-start">
        
        {filteredProducts.map((product) => {
          
          const isLarge = product.tier === "Legendary" || product.tier === "Epic";
          const isExpanded = expandedId === product.id;

          if (isLarge) {
            // Large Display Card (Spans 2 columns)
            return (
              <div key={product.id} className="md:col-span-2 bg-white border border-outline-variant/20 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden relative">
                
                {product.locked && (
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-20 flex items-center justify-center">
                    <div className="bg-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 border border-outline-variant/20">
                      <span className="material-symbols-outlined text-[#c9a84c] text-[20px]">lock</span>
                      <span className="text-sm font-bold text-on-surface">Unlock at Lvl {product.unlockLevel}</span>
                    </div>
                  </div>
                )}

                <Link href={`/shop/${product.id}`} className="w-full md:w-1/2 relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-[220px] bg-surface-container-lowest block shrink-0 z-10 cursor-pointer">
                  <Image src={product.image} alt={product.name} fill className={`object-cover transition-transform duration-700 ${product.locked ? 'blur-sm opacity-80' : 'group-hover:scale-105'}`} />
                  <div className={`absolute top-3 left-3 ${product.tier === 'Legendary' ? 'bg-[#c9a84c] text-white' : 'bg-surface-container-high/90 text-on-surface'} text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm`}>
                    {product.tier === 'Legendary' && <span className="material-symbols-outlined text-[10px]">stars</span>} 
                    {product.tier}
                  </div>
                </Link>

                <div className="w-full md:w-1/2 flex flex-col justify-center h-full z-10">
                  <h2 className="font-display font-black text-2xl text-on-surface mb-2 leading-tight hover:text-[#c9a84c] transition-colors">
                    <Link href={`/shop/${product.id}`}>{product.name}</Link>
                  </h2>
                  <p className="text-on-surface-variant font-medium text-xs leading-relaxed mb-6">
                    {product.shortDescription}
                  </p>
                  <div className="mt-auto">
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="material-symbols-outlined text-[#c9a84c] text-[20px]">monetization_on</span>
                      <span className="font-display font-black text-xl text-[#c9a84c]">{product.price.toLocaleString()} KC</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => handleAction(e, 'add to cart', product.name)}
                        disabled={product.locked}
                        className="bg-surface-container hover:bg-surface-container-high text-on-surface font-bold p-3 rounded-xl transition-colors border border-outline-variant/30"
                      >
                        <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                      </button>
                      <button 
                        onClick={(e) => handleAction(e, 'redeem', product.name)}
                        disabled={product.locked}
                        className="flex-1 bg-[#c9a84c] hover:bg-[#b09038] text-white text-sm font-bold py-3 rounded-xl transition-colors shadow-md shadow-[#c9a84c]/20"
                      >
                        Redeem Now
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          }

          // Standard Grid Item with Expandable Side Panel
          return (
            <div 
              key={product.id} 
              className={`bg-white border border-outline-variant/20 rounded-[1.5rem] p-4 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex ${isExpanded ? 'col-span-1 md:col-span-2 flex-row gap-5 hover:shadow-md' : 'flex-col hover:shadow-md'}`}
            >
              
              {/* Product Visual & Basic Info */}
              <div className={`flex flex-col h-full ${isExpanded ? 'w-[45%] shrink-0' : 'w-full'}`}>
                
                {/* Image links to detail page */}
                <Link href={`/shop/${product.id}`} className="w-full relative rounded-xl overflow-hidden aspect-square bg-surface-container-lowest mb-4 block group cursor-pointer">
                  {product.image.startsWith('icon:') ? (
                    <div className="w-full h-full bg-gradient-to-br from-surface-container-lowest to-surface-container flex items-center justify-center rounded-xl group-hover:scale-105 transition-transform duration-500">
                        <span className="material-symbols-outlined text-[60px] text-[#c9a84c] drop-shadow-sm">
                          {product.image.split(':')[1]}
                        </span>
                    </div>
                  ) : (
                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-on-surface text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm">
                    {product.tier}
                  </div>
                </Link>

                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-base text-on-surface leading-tight hover:text-[#c9a84c] transition-colors">
                    <Link href={`/shop/${product.id}`}>{product.name}</Link>
                  </h3>
                  <button 
                    onClick={(e) => toggleExpand(e, product.id)}
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-surface-container-high text-on-surface' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isExpanded ? 'close' : 'info'}
                    </span>
                  </button>
                </div>

                <p className={`text-[11px] text-on-surface-variant font-medium mb-3 ${isExpanded ? 'line-clamp-none' : 'line-clamp-2'}`}>
                  {product.shortDescription}
                </p>

                <div className="mt-auto flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[#c9a84c] text-[14px]">monetization_on</span>
                    <span className="font-black text-[#c9a84c] text-base">{product.price.toLocaleString()}</span>
                  </div>
                  {!isExpanded && (
                    <button onClick={(e) => toggleExpand(e, product.id)} className="bg-[#c9a84c]/10 text-[#c9a84c] hover:bg-[#c9a84c] hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                      View
                    </button>
                  )}
                </div>
              </div>

              {/* Expanding Info Box */}
              {isExpanded && (
                <div className="w-[55%] flex flex-col pt-1 pb-1 animate-fadeIn border-l border-outline-variant/30 pl-5">
                  
                  <div className="flex items-center gap-1 text-[#c9a84c] mb-1">
                    <span className="material-symbols-outlined text-[12px]">star</span>
                    <span className="text-[11px] font-bold">{product.rating} <span className="text-on-surface-variant font-medium">({product.reviews})</span></span>
                  </div>

                  <h4 className="font-bold text-xs text-on-surface mb-2 mt-3">Included Features</h4>
                  <ul className="flex flex-col gap-1.5 mb-4">
                    {product.features.slice(0,3).map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px] text-on-surface-variant leading-tight">
                         <span className="material-symbols-outlined text-[#c9a84c] text-[12px] shrink-0 mt-0.5">check</span>
                         <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-col gap-2">
                    <button 
                      onClick={(e) => handleAction(e, 'add to cart', product.name)}
                      className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-bold py-2 rounded-lg transition-colors border border-outline-variant/30 flex items-center justify-center gap-1.5 text-xs"
                    >
                      <span className="material-symbols-outlined text-[14px]">add_shopping_cart</span> Cart
                    </button>
                    <button 
                      onClick={(e) => handleAction(e, 'purchase', product.name)}
                      className="w-full bg-[#c9a84c] hover:bg-[#b09038] text-white font-bold py-2 rounded-lg transition-colors shadow-sm shadow-[#c9a84c]/20 flex items-center justify-center gap-1.5 text-xs"
                    >
                      <span className="material-symbols-outlined text-[14px]">shopping_bag</span> Buy Now
                    </button>
                  </div>
                </div>
              )}

            </div>
          );

        })}

      </div>
    </main>
  );
}
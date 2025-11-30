"use client";

import { X, Heart, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  const handleMoveToCart = (item: (typeof wishlistItems)[0]) => {
    addToCart(item);
    removeFromWishlist(item.id);
    onClose();
    setIsCartOpen(true);
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach((item) => {
      addToCart(item);
    });
    clearWishlist();
    onClose();
    setIsCartOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0d1f14] border-l border-[#2a4a35] z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a4a35]">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-[#b8860b] fill-[#b8860b]" />
            <h2 className="text-xl font-serif font-bold text-[#f5f0e1]">
              My Wishlist
            </h2>
            {wishlistItems.length > 0 && (
              <span className="px-2 py-0.5 bg-[#b8860b]/20 text-[#b8860b] text-xs font-semibold rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1a472a] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#f5f0e1]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-[#1a472a]/50 flex items-center justify-center mb-4">
                <Heart className="w-10 h-10 text-[#f5f0e1]/30" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#f5f0e1] mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-[#f5f0e1]/60 text-sm mb-6">
                Save items you love by clicking the heart icon
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="px-6 py-3 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-semibold rounded-full transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-[#1a472a]/20 rounded-xl border border-[#2a4a35]/50 hover:border-[#b8860b]/30 transition-colors"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={onClose}
                    className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={onClose}
                      className="font-serif font-semibold text-[#f5f0e1] hover:text-[#b8860b] transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[#f5f0e1]/50 text-xs mt-0.5">
                      {item.weight}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-[#f5f0e1]">
                        ₹{item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-[#f5f0e1]/40 line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] text-xs font-semibold rounded-full transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-1.5 hover:bg-red-500/20 rounded-full transition-colors group"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4 text-[#f5f0e1]/50 group-hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="p-4 border-t border-[#2a4a35] space-y-3">
            <button
              onClick={handleAddAllToCart}
              className="w-full py-3 bg-[#b8860b] hover:bg-[#d4a017] text-[#0d1f14] font-semibold rounded-full transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Add All to Cart
            </button>
            <button
              onClick={clearWishlist}
              className="w-full py-2 text-[#f5f0e1]/50 hover:text-red-400 text-sm transition-colors"
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </div>
    </>
  );
}

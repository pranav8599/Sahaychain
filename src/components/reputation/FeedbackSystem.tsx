"use client";

import React, { useState } from "react";
import { Star, Send, X, Heart } from "lucide-react";
import { useReputation } from "@/context/ReputationContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function FeedbackSystem({ donorId, donorName, caseTitle, onClose }: { 
  donorId: string, 
  donorName: string, 
  caseTitle: string,
  onClose: () => void 
}) {
  const { submitReview } = useReputation();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await submitReview({
        donorId,
        beneficiaryId: "current_user", // Simplified
        beneficiaryName: "Beneficiary", // Simplified
        rating,
        feedback,
        caseTitle
      });
      setIsSuccess(true);
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black">Express Gratitude</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="text-center">
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">
                  How would you rate your experience with <span className="text-blue-600 font-bold">{donorName}</span> for <span className="font-bold">"{caseTitle}"</span>?
                </p>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="p-1 transition-transform hover:scale-125"
                    >
                      <Star 
                        className={cn(
                          "w-10 h-10 transition-colors",
                          (hover || rating) >= star 
                            ? "fill-amber-400 text-amber-400" 
                            : "text-slate-200 dark:text-slate-700"
                        )} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Your Message</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Leave a thank-you note or success story..."
                  className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 transition-all resize-none font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Appreciation</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-green-600 dark:text-green-400 fill-current" />
              </div>
              <h4 className="text-2xl font-black mb-2">Message Sent!</h4>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Your gratitude has been shared with the donor.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

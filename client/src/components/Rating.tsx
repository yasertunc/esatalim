import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  totalReviews?: number;
}

const Rating: React.FC<RatingProps> = ({
  value = 0,
  onChange,
  readonly = false,
  size = 'md',
  showValue = false,
  totalReviews,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const displayValue = hoverValue ?? value;

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(null)}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-transform ${!readonly && 'hover:scale-110'}`}
          >
            <Star
              className={`${sizes[size]} ${
                star <= displayValue
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
          {value.toFixed(1)}
        </span>
      )}
      {totalReviews !== undefined && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({totalReviews} değerlendirme)
        </span>
      )}
    </div>
  );
};

// Review Card Component
interface Review {
  id: string;
  user: { name: string; avatar?: string };
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

interface ReviewCardProps {
  review: Review;
  onHelpful?: (id: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onHelpful }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {review.user.name[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{review.user.name}</h4>
              <div className="flex items-center space-x-2 mt-1">
                <Rating value={review.rating} readonly size="sm" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {review.date.toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{review.comment}</p>
          <button
            onClick={() => onHelpful?.(review.id)}
            className="mt-3 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            Faydalı ({review.helpful})
          </button>
        </div>
      </div>
    </div>
  );
};

// Review Form Component
interface ReviewFormProps {
  onSubmit: (rating: number, comment: string) => void;
  isLoading?: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isLoading }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      onSubmit(rating, comment);
      setRating(0);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Değerlendirme Yap</h4>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Puanınız
        </label>
        <Rating value={rating} onChange={setRating} size="lg" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Yorumunuz
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Deneyiminizi paylaşın..."
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0 || !comment.trim() || isLoading}
        className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {isLoading ? 'Gönderiliyor...' : 'Değerlendirmeyi Gönder'}
      </button>
    </form>
  );
};

export default Rating;

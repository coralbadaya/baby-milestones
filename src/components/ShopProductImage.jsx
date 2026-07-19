import ImageWithFallback from './ImageWithFallback';
import { BRAND_WATERMARK_SRC } from '../constants/brandAssets';
import { categoryConfig, SHOP_IMAGE_FALLBACK_CATEGORY } from './shopCategoryConfig';

function ShopProductImage({ item, size = 'md' }) {
  const catKey = item.category || SHOP_IMAGE_FALLBACK_CATEGORY;
  const cat = categoryConfig[catKey] || categoryConfig[SHOP_IMAGE_FALLBACK_CATEGORY];
  const isBanner = size === 'banner';

  if (item.image) {
    return (
      <ImageWithFallback
        className={`shop-product-thumb shop-product-thumb--${size}${isBanner ? ' shop-product-thumb--has-img' : ''}`}
        imgClassName="shop-product-thumb__img"
        src={item.image}
        watermarkSrc={BRAND_WATERMARK_SRC}
        alt=""
        fallbackGradient={`linear-gradient(145deg, ${cat.bg} 0%, #FCF8F2 100%)`}
        loading="lazy"
      />
    );
  }

  return (
    <ImageWithFallback
      className={`shop-product-thumb shop-product-thumb--${size}${isBanner ? ' shop-product-thumb--has-img' : ''}`}
      imgClassName="shop-product-thumb__img"
      watermarkSrc={BRAND_WATERMARK_SRC}
      alt=""
      fallbackGradient={`linear-gradient(145deg, ${cat.bg} 0%, #FCF8F2 100%)`}
      loading="lazy"
    />
  );
}

export default ShopProductImage;

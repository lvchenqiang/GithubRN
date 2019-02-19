import {onThemeChange, onShowCustomThemeView, onThemeInit} from './theme';
import {onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite} from './popular';
import {onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite} from './trending';
import {onLoadFavoriteData} from './favorite';

export default {
    onThemeChange,
    onShowCustomThemeView,
    onThemeInit,
    onRefreshPopular,
    onLoadMorePopular,
    onFlushPopularFavorite,
    onRefreshTrending,
    onLoadMoreTrending,
    onFlushTrendingFavorite,
    onLoadFavoriteData
}
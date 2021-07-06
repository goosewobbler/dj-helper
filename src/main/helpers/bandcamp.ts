interface TralbumTrackInfo {
  track_id: number;
  artist: string | null;
  title: string;
  title_link: string;
  duration: number;
}

interface TralbumData {
  current: { artist: string | null; title: string; minimum_price: number };
  trackinfo: TralbumTrackInfo[];
}

interface BandData {
  name: string;
}

interface TralbumCollectInfo {
  is_collected: boolean;
}

const isTrackPage = (url: string) => url.includes('/track/');

export const parseBandcampPageData = (
  TralbumData: TralbumData,
  BandData: BandData,
  TralbumCollectInfo: TralbumCollectInfo,
  bandCurrency: string,
  url: string,
) => ({
  artist: TralbumData.current.artist,
  title: TralbumData.current.title,
  price: TralbumData.current.minimum_price,
  trackinfo: TralbumData.trackinfo.map((track: TralbumTrackInfo) => ({
    artist: track.artist,
    duration: track.duration,
    title: track.title,
    title_link: isTrackPage(url) ? url : `${url}${track.title_link}`,
    id: track.track_id,
  })),
  bandName: BandData.name,
  currency: bandCurrency,
  inCollection: TralbumCollectInfo.is_collected,
});

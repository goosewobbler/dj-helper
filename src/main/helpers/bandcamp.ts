import { URL } from 'node:url';

export interface TralbumTrackInfo {
  track_id: number;
  artist: string | null;
  title: string;
  title_link: string;
  duration: number;
}

export interface TralbumData {
  current: { artist: string | null; title: string; minimum_price: number };
  trackinfo: TralbumTrackInfo[];
}

export interface BandData {
  name: string;
}

export interface TralbumCollectInfo {
  is_collected: boolean;
}

export type BandCurrency = string;

export type ParsedTrackData = {
  artist: string;
  duration: number;
  title: string;
  title_link: string;
  id: number;
};

export type ParsedBandcampData = {
  artist: TralbumData['current']['artist'];
  title: TralbumData['current']['title'];
  price: TralbumData['current']['minimum_price'];
  trackinfo: ParsedTrackData[];
  bandName: BandData['name'];
  currency: BandCurrency;
  inCollection: TralbumCollectInfo['is_collected'];
};

const isTrackPage = (url: string) => url.includes('/track/');

function buildTrackUrl(url: string, title_link: string) {
  if (isTrackPage(url)) {
    return url;
  }

  const { origin } = new URL(url);
  return `${origin}${title_link}`;
}

export const parseBandcampPageData = (
  TralbumData: TralbumData,
  BandData: BandData,
  TralbumCollectInfo: TralbumCollectInfo,
  bandCurrency: BandCurrency,
  url: string,
): ParsedBandcampData => ({
  artist: TralbumData.current.artist,
  title: TralbumData.current.title,
  price: TralbumData.current.minimum_price,
  trackinfo: TralbumData.trackinfo.map((track: TralbumTrackInfo) => ({
    artist: track.artist || TralbumData.current.artist || BandData.name,
    duration: track.duration,
    title: track.title,
    title_link: buildTrackUrl(url, track.title_link),
    id: track.track_id,
  })),
  bandName: BandData.name,
  currency: bandCurrency,
  inCollection: TralbumCollectInfo.is_collected,
});

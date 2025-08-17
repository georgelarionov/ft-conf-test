export default class testUtils {

  public static get Safari() {
    return testUtils.iOSSafari || testUtils.MacosSafari;
  }
  public static get iOSSafari() {
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    return iOS && webkit && !ua.match(/CriOS/i);
  }

  public static get MacosSafari() {
    const uA = navigator.userAgent;
    const vendor = navigator.vendor;
    return /Safari/i.test(uA) && /Apple Computer/.test(vendor) && !/Mobi|Android/i.test(uA);
  }
}

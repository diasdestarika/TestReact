var url_laporansp = ""

if (window.location.hostname.includes('staging')) {
  url_laporansp = 'https://staging-api.cfu.pharmalink.id/report-sp/'
} else if (window.location.hostname.includes('localhost')) {
  url_laporansp = 'http://localhost:1999/report-sp/'
} else {
  url_laporansp = 'https://api.cfu.pharmalink.id/report-sp/'
}

export {
  url_laporansp,
};
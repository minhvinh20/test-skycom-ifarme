function detectDevice() {
  let isIOS = false;
  let isMobile = false;
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    isMobile = true;
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      isIOS = true;
    }
  }
  return { isIOS, isMobile };
}

function disableCopy() {
  fieldName.onpaste = function (e) {
    e.preventDefault();
  };
  fieldPhone.onpaste = function (e) {
    e.preventDefault();
  };
}
disableCopy();

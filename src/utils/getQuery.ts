function getQuery(variable: string) {
  var url = document.location.toString();
  // 如果url中有特殊字符则需要进行一下解码
  url = decodeURI(url);
  var arrObj = url.split('?');
  if (arrObj.length > 1) {
    var arrPara = arrObj[1].split('&');
    var arr;
    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=');
      if (arr != null && arr[0] == variable) {
        return decodeURIComponent(arr[1]);
      }
    }
    return '';
  } else {
    return '';
  }
}

export default getQuery;

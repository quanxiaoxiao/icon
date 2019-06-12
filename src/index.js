const path = require('path');
const https = require('https');
const fs = require('fs');
const {
  fromEvent,
  bindNodeCallback,
} = require('rxjs');
const onFinished = require('on-finished');
const {
  switchMap,
  buffer,
  map,
  tap,
} = require('rxjs/operators');
const getIconData = require('./getIconData');

const pid = '904547';
const ctoken = 'KjKu2GdASp8_egX_oCj59Zba';
const cookie = 'UM_distinctid=16614f62af7898-0cad55e5a23c6c-24414032-1fa400-16614f62af8517; cna=MCoqFFNGHncCAQ05tWokSxgP; EGG_SESS_ICONFONT=U8AXvqwdm-42-umGXGwgKq_Emj2wuVCkA87TjZ3dn6xDIqEssS29Ch4WkwEbRo51UjYxo8wxL1tpZDPr--p5AzX-gV3JrGdzXlKYK-Dgb8xrx8BtdIwi63D-L47rOr8EVAfaFmkJnP_a8YoJLUH5y0BBb6pnwHXyYhf7xpLyCRr-T4DbS7QAciNHnrhRdLgNzgFhoYDtoVejGb0K-MwVaj041K8oWFsy8mzhcM9UFqW3UxE8sK7SdwFLBkETsLVTI-f5FkhAekPbzrAfWivGaurqLy9Y8Z1uMRwYcq9NlGiR1wke_ZmLGJGn_wqtnhXRF177XHLE0GJ3WyXTsj-yRZVixC2hP0wTmEMtPcuPs8B1b4XFpgGp-ZQTB3C_2m1CPkCVnpqdwnDzb4bZN8roc2aJ-_V76sdB-4YMZFrzddHtkPq83y_k_TWNjGz30Ql-XYaW9M4U-3y3mVWF1Qo19IDpVnfSY8td8mHz_cR7JQJ_XqCwqKCb0HtaMluoRuae_dyLg66HScTi9ZsyL3ivzXIUDtkjT1RaxCJ9Ytxj-I4ENthXHy8S36gPTOHYRSJvZdNpkvflXQAaVojd3Na5v2CESkD7RxhLdVz03YAlbftMOwYr-RoL6GTyS4EEnqihPo81uODcjHp1cwTRmyASwGO4paV3QHh8co_cXxP_KYn36u5mTDCgqPM-wUK5vKTk3_rE5ZmkXJYF6FKW3rEspcV6j_pQD3Li2nDXaWxm4T6OVaAfoL9gQUoLwXM3HOTIiIzCqZ_O5n4qNVNw6jwRAcrS67JWmjuh_oNuMOS-3UYJPLNnAWZgJQQMQk7yunaNuujO1hAIF4MExGOY1hLfyYfH1zMV_Wi4Qm8DxvtgB9PxRlXuaciYuMvNSjvJjgl4WvZ_zn26zC40FvgnirruqVrY1_Ie2YAHL-DbyznXqyX52oFcEp6_wtu01YcprU_oC5ejT1lfLjGKS1e6w6sM29vqj80NVHDeb3nlTxnnYZlnfIVke36Z9zdPt4yy-Etx17mGqV2bqyk2X_ST5Q84PQ==; trace=AQAAAKXj2iUgGwkAnzQOcI3tThzpdIWi; ctoken=KjKu2GdASp8_egX_oCj59Zba; u=244867; u.sig=KxVuffbnAKuUbYe11f67psprDplMi9gI7gBTcGLmYUg; CNZZDATA1260547936=458265167-1537949131-%7C1546654003; l=aBqqjK_KyFWRlN9BkMa2NXfpxVF_CC5PimZq1Mak2JhLq9e0bG7SyKto-VwW2_qC5JFy_K-Jc; isg=BMDAvFVPiLPq1nMsq1CdI_tUkUeY0kx2Jkq9MjpRhFtutWDf4lvCoeuDyV3QR1zr';

const req = https.request({
  hostname: 'www.iconfont.cn',
  port: 443,
  method: 'GET',
  path: `/api/project/detail.json?pid=${pid}&t=${Date.now()}&ctoken=${ctoken}`,
  headers: {
    Cookie: cookie,
  },
});

fromEvent(req, 'response')
  .pipe(
    switchMap(res => fromEvent(res, 'data')
      .pipe(
        buffer(bindNodeCallback(onFinished)(res)),
        map(buf => Buffer.concat(buf).toString()),
        map(str => JSON.parse(str)),
        map(obj => obj.data.icons),
        map(list => list.map(item => ({
          code: Number(item.unicode).toString(16),
          ...getIconData(item.show_svg),
        }))),
        tap((obj) => {
          console.log(`create icon count: ${Object.keys(obj).length}`);
        }),
        map(obj => JSON.stringify(obj)),
      )),
  )
  .subscribe((data) => {
    fs.writeFileSync(path.resolve(__dirname, '..', 'aaa.json'), data);
  });

req.end();

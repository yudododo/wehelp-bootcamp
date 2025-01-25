// task 1
let data;
const dataMap = {};
const mrtMap = [];
let tableRows = [];
const fs = require('fs');
const path = require('path');
// 同時 Fetch 兩個 URL
Promise.all([
  fetch(
    'https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-1'
  ).then((response) => response.json()),
  fetch(
    'https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-2'
  ).then((response) => response.json()),
])

  .then(([data1, data2]) => {
    const results1 = data1.data.results;
    const results2 = data2.data;
    // console.log(results1);
    // console.log(results2);

    results1.forEach((item) => {
      const SERIAL_NO = item.SERIAL_NO;
      const fileList = item.filelist || '';
      const match = fileList.match(/^https?:\/\/\S+?(?=https?:\/\/|\s|$)/);
      const ImageURL = match ? match[0] : ''; // 第一個圖片網址
      dataMap[SERIAL_NO] = {
        SpotTitle: item.stitle || '',
        District: [],
        Longitude: item.longitude || '',
        Latitude: item.latitude || '',
        ImageURL: ImageURL || '',
      };
    });

    results2.forEach((item) => {
      const SERIAL_NO = item.SERIAL_NO;
      const match = item.address.match(/[\u4e00-\u9fff]+區/); // 匹配包含「區」的中文字
      const District = match ? match[0] : ''; // 如果匹配成功，取出結果，否則為空字串
      if (dataMap[SERIAL_NO]) {
        // 如果第一個資料有對應的 SERIAL_NO，更新 District
        const record = dataMap[SERIAL_NO];
        record.District = District;
      }
    });
    Object.values(dataMap).forEach((record) => {
      tableRows.push([
        record.SpotTitle,
        record.District,
        record.Longitude,
        record.Latitude,
        record.ImageURL,
      ]);
    });

    const CsvString = tableRows.map((row) => row.join(',')).join('\r\n');
    const filePath = path.join(__dirname, 'spot.csv');
    fs.writeFileSync(filePath, CsvString, 'utf-8');
    console.log('CSV 已保存到:', filePath);

    results2.forEach((item) => {
      const SERIAL_NO = item.SERIAL_NO;
      const MRT = item.MRT;
      // 檢查捷運站是否已經存在於 mrtMap
      let mrtEntry = mrtMap.find((entry) => entry[0] === MRT);
      if (!mrtEntry) {
        // 如果尚未建立此捷運站的陣列，新增一個
        mrtEntry = [MRT];
        mrtMap.push(mrtEntry);
      }
      // 使用 SERIAL_NO 找到景點名稱
      const SpotTitle = results1.find(
        (data) => data.SERIAL_NO === SERIAL_NO
      )?.stitle;
      // 如果找到景點名稱，將其推入捷運站的陣列
      if (SpotTitle) {
        mrtEntry.push(SpotTitle);
      }
    });
    // console.log(mrtMap);

    const CsvString2 = mrtMap.map((row) => row.join(',')).join('\r\n');
    const filePath2 = path.join(__dirname, 'mrt.csv');
    fs.writeFileSync(filePath2, CsvString2, 'utf-8');
    console.log('CSV 已保存到:', filePath);
  })

  .catch((error) => {
    console.error('發生錯誤:', error);
  });








  
// //task 2
// const menu = document.querySelector('.menu');
// const ul = document.querySelector('ul');
// const burger = document.querySelector('.burger');
// const close = document.querySelector('.close');

// menu.addEventListener('click', () => {
//   ul.classList.toggle('visible');
//   burger.classList.toggle('hidden');
//   close.classList.toggle('show');
// });

// fetch(
//   ' https://padax.github.io/taipei-day-trip-resources/taipei-attractions-assignment-1 '
// )
//   .then(function (response) {
//     return response.json();
//   })
//   .then(function (myJson) {
//     const result = myJson.data.results;
//     const topThree = result.slice(0, 3);
//     // const four = result.slice(3, 13);

//     const smallBoxes = document.querySelectorAll('.smallBox');
//     const bigBoxes = document.querySelectorAll('.bigBox');

//     topThree.forEach((item, index) => {
//       const fileList = item.filelist || '';
//       const match = fileList.match(/^https?:\/\/\S+?(?=https?:\/\/|\s|$)/);
//       const ImageURL = match ? match[0] : '';
//       const stitle = item.stitle;
//       const box = smallBoxes[index];
//       box.innerHTML = '';
//       const img = document.createElement('img');
//       img.src = ImageURL;
//       const text = document.createElement('p');
//       text.textContent = stitle;

//       box.appendChild(img);
//       box.appendChild(text);
//     });

//     let currentIndex = 3;
//     const pageSize = 10;
//     let isFirstRender = true;
//     function render() {
//       if (isFirstRender) {
//         bigBoxes.forEach((box) => {
//           box.remove();
//         });
//         isFirstRender = false;
//       }
//       const four = result.slice(currentIndex, currentIndex + pageSize);
//       four.forEach((item, index) => {
//         const fileList = item.filelist || '';
//         const match = fileList.match(/^https?:\/\/\S+?(?=https?:\/\/|\s|$)/);
//         const ImageURL = match ? match[0] : '';
//         const stitle = item.stitle;
//         const box = document.createElement('div');
//         box.classList.add('box', 'bigBox');
//         const img = document.createElement('img');
//         img.src = ImageURL;
//         const text = document.createElement('p');
//         text.textContent = stitle;

//         const starImg = document.createElement('img');
//         starImg.src = './images/star.png';
//         starImg.classList.add('star');

//         box.appendChild(starImg);
//         box.appendChild(img);
//         box.appendChild(text);

//         const content = document.querySelector('.content');
//         content.appendChild(box);
//       });
//       currentIndex += pageSize;
//     }
//     render();

//     const button = document.querySelector('button');
//     button.addEventListener('click', () => {
//       console.log('button clicked');
//       render();
//       if (currentIndex >= result.length) {
//         console.log('No more data to load'); // 如果資料已全部載入，停止
//         button.remove();
//         return;
//       }
//       console.log(currentIndex);
//     });
//     // console.log(result);
//   });

// function pcCSS() {
//   const style = document.createElement('style');
//   let css = '';

//   for (let i = 1; i <= 100; i++) {
//     const row = Math.ceil((i - 3) / 5) + 1; // 從第4個開始，每5個換一行，初始 row=2
//     if (i <= 3) {
//       // 前3個特別處理
//       css += `
//           .box:nth-of-type(${i}) {
//             grid-column: ${i * 2 - 1} / ${i * 2 + 1};
//           }
//         `;
//     } else if ((i - 3) % 5 === 1) {
//       const column = (i - 3) % 5;
//       css += `
//           .box:nth-of-type(${i}) {
//             grid-column: ${column} / ${column + 2};
//             grid-row: ${row} / ${row + 1};
//           }
//         `;
//     } else if ((i - 3) % 5 === 0) {
//       const column = ((i - 3) % 5) + 6;
//       css += `
//               .box:nth-of-type(${i}) {
//                 grid-column: ${column} / ${column + 1};
//                 grid-row: ${row} / ${row + 1};
//               }
//             `;
//     } else {
//       const column = ((i - 3) % 5) + 1; // 根據 (index % 5) 確定列數
//       css += `
//           .box:nth-of-type(${i}) {
//             grid-column: ${column} / ${column + 1};
//             grid-row: ${row} / ${row + 1};
//           }
//         `;
//     }
//   }

//   style.textContent = css;
//   document.head.appendChild(style);
// }

// // pcCSS();

// function ipadCSS() {
//   const style = document.createElement('style');
//   let css = '';

//   css += `
//   @media screen and (max-width: 1200px) {
//     .content {
//       width: 90%;
//       grid-template-columns: repeat(4, 1fr);
//       grid-template-rows: 50px 50px;
//       grid-auto-rows: 200px;
//     }
//   }
//   `;
//   for (let i = 1; i <= 100; i++) {
//     row = 3;
//     if (i <= 3) {
//       let row = ((i - 3) % 4) + 1;
//       css += `
//         .box:nth-of-type(1){
//           grid-column:1/3;
//         }
//         .box:nth-of-type(2){
//           grid-column:3/5;
//         }
//         .box:nth-of-type(3){
//           grid-column:1/5;
//           grid-row:2/3;
//         }
//       `;
//     } else if ((i - 3) % 10 === 9) {
//       let n = Math.floor((i - 2) / 10) + 1;
//       let a_n = (n - 1) * 3 + 2;
//       row = a_n;
//       css += `
//         .box:nth-of-type(${i}) {
//           grid-column: 1/3;
//           grid-row: ${row} / ${row + 1};
//         }
//       `;
//     } else if ((i - 3) % 10 === 0) {
//       let n = Math.floor((i - 2) / 10) + 1;
//       let a_n = (n - 1) * 3 + 2;
//       // console.log(`i = ${i}, n = ${n}, a_n = ${a_n}`);
//       row = a_n;
//       css += `
//         .box:nth-of-type(${i}) {
//           grid-column: 3/5;
//           grid-row: ${row} / ${row + 1};
//         }
//       `;
//     }
//   }
//   css += '}'; // 結束 media query

//   style.textContent = css;
//   document.head.appendChild(style);
// }
// // ipadCSS();

// function mobileCSS() {
//   const style = document.createElement('style');
//   let css = '';

//   css += `
//   @media screen and (max-width: 600px) {
//     .content{
//     display:flex;
//     flex-direction: column;
//     }
//   }
//   `;
//   css += '}'; // 結束 media query

//   style.textContent = css;
//   document.head.appendChild(style);
// }
// // mobileCSS();

// function onResize() {
//   const screenWidth = window.innerWidth;
//   // if (screenWidth <= 600) {
//   //   mobileCSS();
//   // } else if (screenWidth <= 1200) {
//   //   ipadCSS();
//   // } else{
//   //   pcCSS();
//   // }

//   if (screenWidth >= 1200) {
//     pcCSS();
//   } else if (screenWidth >= 600) {
//     ipadCSS();
//   } else {
//     mobileCSS();
//   }
// }
// onResize();

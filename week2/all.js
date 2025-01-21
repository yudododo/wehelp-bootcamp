console.log('---task 1---');
function findAndPrint(messages, currentStation) {
  //indexOf()會判斷陣列中是否包含某個值，如果有包含就回傳這個值在陣列中的索引值，沒有回傳-1
  const friend = Object.keys(messages); //['Bob', 'Mary', 'Copper', 'Leslie', 'Vivian']
  const friendMessages = Object.values(messages); //['I'm at Ximen MRT station.', 'I have a drink near Jingmei MRT station.', 'I just saw a concert at Taipei Arena.', 'I'm at home near Xiaobitan station.', 'I'm at Xindian station waiting for you.']
  const fStationIndex = [];

  friendMessages.forEach((message) => {
    line.forEach((station, index) => {
      // 如果 station 是字串，直接檢查是否包含
      if (typeof station === 'string' && message.includes(station)) {
        fStationIndex.push(index);
      }
      // 如果 station 是陣列，檢查陣列中的每個車站是否包含
      if (Array.isArray(station)) {
        station.forEach((subStation) => {
          if (message.includes(subStation)) {
            fStationIndex.push(index);
          }
        });
      }
    });
  });

  if (currentStation === 'Xindian' || currentStation === 'Xindian City Hall') {
    friendMessages.forEach((message, idx) => {
      if (message.includes('Xiaobitan')) {
        // 如果朋友在 "Xiaobitan"，距離加 2
        fStationIndex[idx] = fStationIndex[idx] + 2;
      }
    });
  }
  let currentStationIndex = '';
  line.forEach((station, index) => {
    // 如果 station 是字串，直接檢查是否匹配
    if (typeof station === 'string' && station === currentStation) {
      currentStationIndex = index;
    }
    // 如果 station 是陣列，檢查陣列中的每個元素是否匹配
    if (Array.isArray(station)) {
      if (station.includes(currentStation)) {
        currentStationIndex = index;
      }
    }
  });

  const absoluteDis = fStationIndex.map((value) =>
    Math.abs(value - currentStationIndex)
  );
  let closestFriendIndex = absoluteDis.indexOf(Math.min(...absoluteDis));
  let closestFriendName = friend[closestFriendIndex];
  // console.log("fStationIndex",fStationIndex)
  // console.log(line.indexOf(currentStation))
  // console.log("absoluteDis",absoluteDis)
  // console.log("closestFriendIndex",closestFriendIndex)
  // console.log("currentStationIndex",currentStationIndex)
  console.log(closestFriendName);
}
const line = [
  'Songshan',
  'Nanjing Sanmin',
  'Taipei Arena',
  'Nanjing Fuxing',
  'Songjiang Nanjing',
  'Zhongshan',
  'Beimen',
  'Ximen',
  'Xiaonanmen',
  'Chiang Kai-Shek Memorial Hall',
  'Guting',
  'Taipower Building',
  'Gongguan',
  'Wanlong',
  'Jingmei',
  'Dapinglin',
  'Qizhang',
  ['Xiaobitan', 'Xindian City Hall'],
  'Xindian',
];

const messages = {
  Bob: "I'm at Ximen MRT station.",
  Mary: 'I have a drink near Jingmei MRT station.',
  Copper: 'I just saw a concert at Taipei Arena.',
  Leslie: "I'm at home near Xiaobitan station.", //會出問題
  Vivian: "I'm at Xindian station waiting for you.",
};
findAndPrint(messages, 'Wanlong'); // print Mary
findAndPrint(messages, 'Songshan'); // print Copper
findAndPrint(messages, 'Qizhang'); // print Leslie  會出問題
findAndPrint(messages, 'Ximen'); // print Bob
findAndPrint(messages, 'Xindian City Hall'); // print Vivian  會出問題










console.log('---task 2---');
const consultantTimes = {
  John: [],
  Bob: [],
  Jenny: [],
};
function book(consultants, hour, duration, criteria) {
  let selectedConsultant = '';
  const hours = [];
  for (let i = 0; i < duration; i++) {
    hours.push(hour + i); // 推入每一個小時
  }
  if (criteria == 'price') {
    // 根據價格排序顧問，從便宜到貴
    consultants.sort((a, b) => a.price - b.price);
    // selectedConsultant = consultants[0]; // 選擇最便宜的顧問
  } else if (criteria == 'rate') {
    // 根據評分排序顧問，從高到低
    consultants.sort((a, b) => b.rate - a.rate);
    // selectedConsultant = consultants[0]; // 選擇評分最高的顧問
  }
  for (let consultant of consultants) {
    // Check if the consultant is available (no overlap in hours)
    const bookedHours = consultantTimes[consultant.name];
    const isAvailable = !bookedHours.some((bookedHour) =>
      hours.includes(bookedHour)
    );

    if (isAvailable) {
      // If consultant is available, add the hours to their booking
      consultantTimes[consultant.name] = bookedHours.concat(hours);
      selectedConsultant = consultant;
      break; // Exit the loop once we find an available consultant
    }
  }
  if (selectedConsultant) {
    console.log(selectedConsultant.name);
  } else {
    console.log('No Service');
  }
  // console.log(consultantTimes);
}
const consultants = [
  { name: 'John', rate: 4.5, price: 1000 },
  { name: 'Bob', rate: 3, price: 1200 },
  { name: 'Jenny', rate: 3.8, price: 800 },
];
book(consultants, 15, 1, 'price'); // Jenny
book(consultants, 11, 2, 'price'); // Jenny
book(consultants, 10, 2, 'price'); // John
book(consultants, 20, 2, 'rate'); // John
book(consultants, 11, 1, 'rate'); // Bob
book(consultants, 11, 2, 'rate'); // No Service
book(consultants, 14, 3, 'price'); // John










console.log('---task 3---');
function func(...data) {
  const newData = data.map((name) => {
    if (name.length === 2 || name.length === 3) {
      return name[1];
    } else if (name.length === 4 || name.length === 5) {
      return name[2];
    } else {
      return null; // 其他情況不處理
    }
  });
  // console.log(newData);

  const count = {};
  newData.forEach((char) => {
    count[char] = (count[char] || 0) + 1;
    // console.log(char);
  });

  // 篩選出只出現一次的字母
  const uniqueChars = Object.keys(count).filter((char) => count[char] === 1);
  // console.log(uniqueChars);

  if (uniqueChars.length === 0) {
    console.log('沒有');
  } else {
    // 找到對應的原始名稱
    newData.forEach((char, idx) => {
      if (uniqueChars.includes(char)) {
        console.log(data[idx]);
      }
    });
  }
}

func('彭大牆', '陳王明雅', '吳明'); // print 彭大牆
func('郭靜雅', '王立強', '郭林靜宜', '郭立恆', '林花花'); // print 林花花
func('郭宣雅', '林靜宜', '郭宣恆', '林靜花'); // print 沒有
func('郭宣雅', '夏曼藍波安', '郭宣恆'); // print 夏曼藍波安









console.log('---task 4---');
function getNumber(index) {
  let num = 0; // 起始值
  for (let i = 0; i < index; i++) {
    if (i % 3 === 0) {
      num += 4; // 每 3 項中的第 1 項：+4
    } else if (i % 3 === 1) {
      num += 4; // 每 3 項中的第 2 項：+4
    } else {
      num -= 1; // 每 3 項中的第 3 項：-1
    }
  }
  console.log(num);
  return num;
}
getNumber(1); // print 4
getNumber(5); // print 1
getNumber(10); // print 25
getNumber(30); // print 70
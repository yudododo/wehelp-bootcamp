print("---task1---")
def find_and_print(messages, current_station):
    line = ["Songshan", "Nanjing Sanmin", "Taipei Arena", "Nanjing Fuxing", "Songjiang Nanjing", "Zhongshan", "Beimen", "Ximen", "Xiaonanmen", "Chiang Kai-Shek Memorial Hall", "Guting", "Taipower Building", "Gongguan", "Wanlong", "Jingmei", "Dapinglin", "Qizhang", ["Xiaobitan", "Xindian City Hall"], "Xindian"]
    # 提取好友名和訊息
    friends = list(messages.keys())
    friend_messages = list(messages.values())
    f_station_indices = []

    # 找出朋友所處的車站位置
    for message in friend_messages:
        for index, station in enumerate(line):
            if isinstance(station, str) and station in message:
                f_station_indices.append(index)
            elif isinstance(station, list):
                if any(sub_station in message for sub_station in station):
                    f_station_indices.append(index)

    # 特殊處理 Xiaobitan 情況
    if current_station in ["Xindian", "Xindian City Hall"]:
        for idx, message in enumerate(friend_messages):
            if "Xiaobitan" in message:
                f_station_indices[idx] += 2

    # 找出目前所在車站的索引
    current_station_index = None
    for index, station in enumerate(line):
        if isinstance(station, str) and station == current_station:
            current_station_index = index
        elif isinstance(station, list) and current_station in station:
            current_station_index = index

    # 計算距離並找出最近的朋友
    absolute_distances = [abs(value - current_station_index) for value in f_station_indices]
    closest_friend_index = absolute_distances.index(min(absolute_distances))
    closest_friend_name = friends[closest_friend_index]
    print(closest_friend_name)

messages={
  "Leslie":"I'm at home near Xiaobitan station.",
  "Bob":"I'm at Ximen MRT station.",
  "Mary":"I have a drink near Jingmei MRT station.",
  "Copper":"I just saw a concert at Taipei Arena.",
  "Vivian":"I'm at Xindian station waiting for you."
  }
find_and_print(messages, "Wanlong") # print Mary
find_and_print(messages, "Songshan") # print Copper
find_and_print(messages, "Qizhang") # print Leslie
find_and_print(messages, "Ximen") # print Bob
find_and_print(messages, "Xindian City Hall") # print Vivian










print("---task2---")
consultant_times = {}
def book(consultants, hour, duration, criteria):
  global consultant_times  # 如果需要在函數內修改全域變數，可以保留這行（也可以省略）
  
  # 初始化全域變數（只執行一次）
  if not consultant_times:
    consultant_times = {consultant["name"]: [] for consultant in consultants}

  selected_consultant = None
  hours = [hour + i for i in range(duration)] 

  if criteria == "price":
    consultants.sort(key=lambda x: x["price"])
  elif criteria == "rate":
    consultants.sort(key=lambda x: x["rate"], reverse=True)

  # 檢查每位顧問是否有空檔
  for consultant in consultants:
    booked_hours = consultant_times[consultant["name"]]
    is_available = not any(h in booked_hours for h in hours)

    if is_available:
      # 如果顧問有空，將時間段加入預訂
      consultant_times[consultant["name"]].extend(hours)
      selected_consultant = consultant
      break

  if selected_consultant:
    print(selected_consultant["name"])
  else:
    print("No Service")

consultants=[ 
{"name":"John", "rate":4.5, "price":1000}, 
{"name":"Bob", "rate":3, "price":1200}, 
{"name":"Jenny", "rate":3.8, "price":800} 
]  
book(consultants, 15, 1, "price") # Jenny 
book(consultants, 11, 2, "price") # Jenny 
book(consultants, 10, 2, "price") # John 
book(consultants, 20, 2, "rate") # John 
book(consultants, 11, 1, "rate") # Bob 
book(consultants, 11, 2, "rate") # No Service 
book(consultants, 14, 3, "price") # John 










print("---task3---")
def func(*data):
  # 將名字轉換成符合條件的字母
  new_data = []
  for name in data:
    if len(name) == 2 or len(name) == 3:
      new_data.append(name[1])
    elif len(name) == 4 or len(name) == 5:
      new_data.append(name[2])
    else:
      new_data.append(None)  # 其他情況不處理

  # 計算每個字母的出現次數
  count = {}
  for char in new_data:
    if char in count:
      count[char] += 1
    else:
      count[char] = 1

  # 篩選出只出現一次的字母
  unique_chars = [char for char, c in count.items() if c == 1]

  if not unique_chars:
    print("沒有")
  else:
    # 找到對應的原始名稱
    for idx, char in enumerate(new_data):
      if char in unique_chars:
        print(data[idx])

func("彭大牆", "陳王明雅", "吳明") # print 彭大牆 
func("郭靜雅", "王立強", "郭林靜宜", "郭立恆", "林花花") # print 林花花 
func("郭宣雅", "林靜宜", "郭宣恆", "林靜花") # print 沒有 
func("郭宣雅", "夏曼藍波安", "郭宣恆") # print 夏曼藍波安 










print("---task4---")
def get_number(index):
  num = 0  # 起始值
  for i in range(index):
    if i % 3 == 0:
      num += 4  # 每 3 項中的第 1 項：+4
    elif i % 3 == 1:
      num += 4  # 每 3 項中的第 2 項：+4
    else:
      num -= 1  # 每 3 項中的第 3 項：-1
  print(num)

get_number(1) # print 4
get_number(5) # print 15
get_number(10) # print 25
get_number(30) # print 70
# Firebase Dashboard 数据添加指南

## 🚀 快速添加步骤

### 1. 打开Firebase控制台
- https://console.firebase.google.com/
- 选择项目: `fit5032-a3-xilongwang`
- 点击 **Firestore Database**

---

## 📋 集合1: dashboard_annual_trends

**点击"开始收集"，集合ID输入: `dashboard_annual_trends`**

然后添加9个文档，每个文档点击"添加文档"：

### 🟢 一次性复制粘贴（推荐）

在Firebase控制台，你可以用JSON格式批量导入。但手动添加更简单：

| 文档ID | year | participants | participationRate | notes |
|--------|------|--------------|-------------------|-------|
| 2015 | 2015 | 749037 | 12.6% | (留空) |
| 2016 | 2016 | 827974 | 13.4% | (留空) |
| 2017 | 2017 | 857400 | 13.6% | (留空) |
| 2018 | 2018 | 845135 | 13.1% | (留空) |
| 2019 | 2019 | 864410 | 13.1% | (留空) |
| 2020 | 2020 | 634130 | 9.5% | COVID Impact |
| 2021 | 2021 | 862246 | 13.2% | Recovery |
| 2022 | 2022 | 919112 | 13.9% | (留空) |
| 2023 | 2023 | 939295 | 14.2% | Historical High |

**重要：**
- `year` 和 `participants` 字段类型选择 **number**
- `participationRate` 和 `notes` 字段类型选择 **string**

---

## 📋 集合2: dashboard_regional

**集合ID: `dashboard_regional`**

| 文档ID | regionType | highestLGA | highestRate | lowestLGA | lowestRate |
|--------|-----------|------------|-------------|-----------|------------|
| metro_other | Metropolitan - Other | Bayside | 26.2% | Greater Dandenong | 5.3% |
| metro_growth | Metropolitan - Growth | Cardinia | 14.2% | Melton | 8.7% |
| regional_growth | Regional - Growth | Surf Coast | 24.7% | Moorabool | 14.2% |
| regional_other | Regional - Other | Buloke | 26.9% | Hepburn | 11.7% |

**所有字段类型：string**

---

## 📋 集合3: dashboard_age_distribution

**集合ID: `dashboard_age_distribution`**

| 文档ID | ageGroup | participationRate | category | rateValue |
|--------|----------|-------------------|----------|-----------|
| age_4 | 4 years | 25% | Early Childhood | 25 |
| age_5_9 | 5-9 years | 58% | Primary School | 58 |
| age_10_14 | 10-14 years | 61% | Secondary School | 61 |
| age_15_19 | 15-19 years | 32% | Late Teens | 32 |
| age_20_24 | 20-24 years | 14% | Young Adults | 14 |
| age_25_29 | 25-29 years | 12% | Adults | 12 |
| age_30_34 | 30-34 years | 11% | Adults | 11 |
| age_35_plus | 35+ years | <7% | Mature Adults | 7 |

**字段类型：**
- `ageGroup`, `participationRate`, `category`: **string**
- `rateValue`: **number**

---

## 📋 集合4: dashboard_gender

**集合ID: `dashboard_gender`**

| 文档ID | gender | participants | participationRate | category | rateValue |
|--------|--------|--------------|-------------------|----------|-----------|
| male | Male | 727578 | 22.2% | Individual | 22.2 |
| female | Female | 389499 | 11.6% | Individual | 11.6 |
| total | Total (16 Sports) | 1117077 | 16.9% | Combined | 16.9 |

**字段类型：**
- `gender`, `participationRate`, `category`: **string**
- `participants`, `rateValue`: **number**

---

## ✅ 完成检查

添加完成后，你应该在Firestore Database中看到：

```
Firestore Database
├── activities (你的活动数据)
├── users (用户数据)
├── dashboard_annual_trends (9个文档)
├── dashboard_regional (4个文档)
├── dashboard_age_distribution (8个文档)
└── dashboard_gender (3个文档)
```

**总共：4个Dashboard集合，24个文档**

---

## 🧪 测试

1. 保存所有文件
2. 运行 `npm run dev`
3. 访问 Dashboard 页面
4. 如果看到图表正常显示，说明成功了！

---

## 💡 提示

- 如果字段类型选错了，点击字段旁边的"编辑"可以修改
- 如果文档ID输错了，删除重新添加（文档ID不能修改）
- 添加完一个集合后，记得点击"保存"

---

## 🎉 优势

现在Dashboard数据在Firestore中：
- ✅ 代码更简洁（从400行减少到200行）
- ✅ 数据可以随时在Firebase控制台修改
- ✅ 多个用户可以共享同一份Dashboard数据
- ✅ 可以添加管理员界面来更新Dashboard数据
- ✅ 满足REST API要求（第三方可以读取Dashboard统计）

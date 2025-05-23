# 🌤️ Weather Dashboard — Group 3

**Team Members:** Paulina Teran, Tyrone Li  
**Course:** INFO 474  
**Date:** May 2025  
**Group:** 3  

## 📊 Project Overview

This dashboard explores **daily historical weather data** between July 2014 and June 2015 from six U.S. cities:  
**Indianapolis, Charlotte, Chicago, Phoenix, Jacksonville, and Philadelphia**.

The dataset includes:
- **Temperature** (mean, high, low)
- **Precipitation**
- **Historical averages and records**

Each row in the data represents one day of recorded observations.

📄 **Data Source:**  
- Historical weather: [Weather Underground](https://www.wunderground.com/history)  
- [Project Documentation](https://docs.google.com/document/d/15HiHTsKK8wbD6lOnJ1OmwlQJWHq4I1HsKmQBMVJanOc/edit?tab=t.0)

## 🌡️ Visualizations

### 1. Mean Temperature Trend Over Time
- **X-axis:** Date (July 2014 – June 2015)  
- **Y-axis:** Actual Mean Temperature (°F)  
- **Filter:** City selector dropdown  
- **Type:** Multi-line chart  

📌 *Insight:*  
Phoenix, AZ consistently shows the highest temperatures; Chicago, IL is coldest year-round. Winter peaks in Jacksonville, FL stand out.


### 2. Record-Breaking Temperature Frequency
- **X-axis:** Year  
- **Y-axis:** Frequency of record temperatures  
- **Filter:** Toggle switch (Max/Min Temp), year range slider  
- **Type:** Stacked histogram  

📌 *Insight:*  
More record **high** temperatures than **low**, especially post-1940s, showing warming extremes and ongoing climate variability.
<!-- 
---

### 3. Precipitation Distribution
- **X-axis:** Precipitation (inches)  
- **Y-axis:** Frequency  
- **Filter:** City dropdown  
- **Type:** Histogram  

📌 *Insight:*  
Most cities experience low daily precipitation, with occasional high outliers. Grouped bin ranges show skewness in rainfall distribution. -->


## 🔧 Interactive Features (Planned)
- Dropdown for selecting individual cities  
- Toggle switch to show/hide min/max record data  

---

## 📁 Files
- `index.html` — Webpage structure and header  
- `main.js` — D3 loading, visualization logic  
- `weather.csv` — Weather dataset  
- `styles.css` — Styling  
<!-- ---

## 🧠 Challenges & Solutions
- **Challenge:** Overlapping city lines on the mean temperature chart  
  **Solution:** Limited the view to 4 cities and plan to add a dropdown filter for clarity.  
- **Challenge:** Interpreting and visualizing record years as categorical data  
  **Solution:** Used a stacked histogram with toggles for min/max record control.  
- **Challenge:** Cluttered visuals when all cities shown at once  
  **Solution:** Prototyped cleaner interactions using Google Sheets to find balance.   -->

---

<!-- ## ✅ Contributions
- **Paulina Teran**  
- **Tyrone Li**  
--- -->

## License
This project is for academic use only. Data belongs to respective providers.

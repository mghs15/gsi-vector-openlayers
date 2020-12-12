
//Sprite-----------------------------------------------------------------
const loadJSON = function(path){
  
  var data = [];
  
  var xhr = new XMLHttpRequest();
  xhr.open('GET', path, false);
  xhr.send(null);
  
  if(xhr.status == 200 || xhr.status == 304){
    data = JSON.parse(xhr.responseText);
  }
  
  return data;
}

const spritejson = loadJSON('https://maps.gsi.go.jp/vector/sprite/std.json');
const iconStyleOption = (iconname) => {

  if(spritejson[iconname]){
    const info = spritejson[iconname];
    const style =  {
      src: 'https://maps.gsi.go.jp/vector/sprite/std.png',
      size: [info.width, info.height],
      offset: [info.x, info.y],
      scale: 0.5
    };
    
    return style;
  }else{
    return null;
  }
  
}

const showIcon = (code) => {
  if(!code) return null;
  let iconname = "unknown";
  switch(+code){
    case 1401:
      iconname = "都道府県所在地-20"; break;
    case 1402:
      iconname = "市役所・東京都の区役所-20"; break;
    case 1403:
      iconname = "町村役場・政令指定都市の区役所-20"; break;
    case 3201:
      iconname = "官公署"; break;
    case 3202:
      iconname = "裁判所"; break;
    case 3205:
      iconname = "市役所・東京都の区役所"; break;
    case 3206:
      iconname = "町村役場・政令指定都市の区役所"; break;
    case 3211:
      iconname = "交番"; break;
    case 3212:
      iconname = "高等学校・中等教育学校"; break;
    case 3214:
      iconname = "小学校"; break;
    case 3213:
      iconname = "中学校"; break;
    case 3214:
      iconname = "小学校"; break;
    case 3215:
      iconname = "老人ホーム"; break;
    case 3216:
      iconname = "博物館法の登録博物館・博物館相当施設"; break;
    case 3217:
      iconname = "図書館"; break;
    case 3218:
      iconname = "郵便局"; break;
    case 3221:
      iconname = "灯台"; break;
    case 3231:
      iconname = "神社"; break;
    case 3232:
      iconname = "寺院"; break;
    case 3241:
      iconname = "警察署"; break;
    case 3242:
      iconname = "消防署"; break;
    case 3243:
      iconname = "病院"; break;
    case 3244:
      iconname = "保健所"; break;
    case 4101:
      iconname = "煙突"; break;
    case 4102:
      iconname = "風車"; break;
    case 4103:
      iconname = "油井・ガス井"; break;
    case 4104:
      iconname = "記念碑"; break;
    case 4105:
      iconname = "自然災害伝承碑"; break;
    case 6301:
      iconname = "墓地"; break;
    case 6311:
      iconname = "田"; break;
    case 6312:
      iconname = "畑"; break;
    case 6313:
      iconname = "茶畑"; break;
    case 6314:
      iconname = "果樹園"; break;
    case 6321:
      iconname = "広葉樹林"; break;
    case 6322:
      iconname = "針葉樹林"; break;
    case 6323:
      iconname = "竹林"; break;
    case 6324:
      iconname = "ヤシ科樹林"; break;
    case 6325:
      iconname = "ハイマツ地"; break;
    case 6326:
      iconname = "笹地"; break;
    case 6327:
      iconname = "荒地"; break;
    case 6331:
      iconname = "温泉"; break;
    case 6332:
      iconname = "噴火口・噴気口"; break;
    case 6341:
      iconname = "史跡・名勝・天然記念物"; break;
    case 6342:
      iconname = "城跡"; break;
    case 6351:
      iconname = "採鉱地"; break;
    case 6361:
      iconname = "港湾"; break;
    case 6362:
      iconname = "漁港"; break;
    case 6371:
      iconname = "国際空港-20"; break;
    case 6372:
      iconname = "自衛隊等の飛行場-20"; break;
    case 6381:
      iconname = "自衛隊-20"; break;
    case 7102:
      iconname = "三角点"; break;
    case 7103:
      iconname = "水準点"; break;
    case 7101:
      iconname = "電子基準点"; break;
    case 8103:
      iconname = "発電所等"; break;
    case 8105:
      iconname = "電波塔"; break;
    default:
      iconname = "指示点"; break;
  }

  return new ol.style.Icon(iconStyleOption(iconname));
}


//基本的な設定等-----------------------------------------------------------------

//const roadLWidth = 2;
const roadLDash = [5,5];
const roadLWidth = (f) => {
  if(f.properties_.rnkWidth){ 
    return +f.properties_.rnkWidth + 1;
  }else{
    return 2;
  }
}

const roadLColor = (f) => {
  switch(f.properties_.rdCtg){
    case 0:
      return 'rgba(255,190,190,1)';
      break;
    case 1:
      return 'rgba(255,211,111,1)';
      break;
    default:
      return 'rgba(210,210,210,1)';
  }

}

const contourLWidth = (f) => {
  const keikyoku = +f.properties_.alti % 50;
  if(keikyoku == 0){
    return 1;
  }else{
    return 0.5;
  }
}

const stylingVectorTile = (rf, num) => {
  
  return [
    //水域--------------------------------------------
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "waterarea"
      ) return f;},
      fill: new ol.style.Fill({
        color: 'rgba(220,220,255,1)'
      })
    }),
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "coastline" ||
        f.properties_.layer == "river" ||
        f.properties_.layer == "lake"
      ) return f;},
      stroke: new ol.style.Stroke({
        color: 'rgba(220,220,255,1)',
        width: 1
      })
    }),
    
    //建物--------------------------------------------
    new ol.style.Style({
      geometry: (f) => {if(
        (f.properties_.layer == "building" || f.properties_.layer == "structurea") &&
        (f.type_ == "Polygon" || f.type_ == "MultiPolygon")
      ) return f;},
      fill: new ol.style.Fill({
        color: 'rgba(150,150,150,1)'
      }),
      zIndex: 100
    }),
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "wstructurea"
      ) return f;},
      fill: new ol.style.Fill({
        color: 'rgba(255,255,255,1)'
      }),
      zIndex: 2
    }),
    
    
    //等高線--------------------------------------------
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "contour"
      ) return f;},
      stroke: new ol.style.Stroke({
        color: 'rgba(230,230,230,1)',
        width: contourLWidth(rf)
      }),
      zIndex: 10
    }),
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "contour" &&
        f.properties_.ftCode == 7352 &&
        f.properties_.alti
      ) return f;},
      text: new ol.style.Text({
        text: "" + rf.properties_.alti,
        placement: 'line',
        fill: new ol.style.Fill({
          color: 'rgba(230,230,230,1)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255,255,255,1)',
          width: 2
        })
      }),
      zIndex: 11
    }),

    
    //境界--------------------------------------------
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "boundary" &&
        f.properties_.ftCode != 6101
      ) return f;},
      stroke: new ol.style.Stroke({
        color: 'rgba(100,0,200,0.3)',
        width: 2,
        lineDash: [5,3,2,2]
      }),
      zIndex: 10
    }),
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "boundary" &&
        f.properties_.ftCode == 6101
      ) return f;},
      stroke: new ol.style.Stroke({
        color: 'rgba(230,230,230,1)',
        width: 1,
        lineDash: [5,3,2,2]
      }),
      zIndex: 10
    }),
        
    //道路　通常部--------------------------------------------
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "road" &&
        f.properties_.ftCode > 2710  &&
        f.properties_.ftCode < 9999  &&
        f.properties_.motorway != 1
      ) return f;},
      stroke: new ol.style.Stroke({
        color: roadLColor(rf),
        width: 1,
        lineDash: [2,2]
      }),
      zIndex: 1000 + rf.properties_.lvOrder + 10 - rf.properties_.rdCtg 
    }),
    
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "road" &&
        (f.properties_.ftCode == 2701 || f.properties_.ftCode == 2702) &&
        f.properties_.motorway != 1
      ) return f;},
      stroke: new ol.style.Stroke({
        color: roadLColor(rf),
        width: roadLWidth(rf)
      }),
      zIndex: 1000 + rf.properties_.lvOrder + 10 - rf.properties_.rdCtg 
    }),
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "road" &&
        (f.properties_.ftCode == 2701 || f.properties_.ftCode == 2702)  &&
        f.properties_.motorway == 1
      ) return f;},
      stroke: new ol.style.Stroke({
        color: 'rgba(0,151,0,1)',
        width: roadLWidth(rf)
      }),
      zIndex: 1000 + rf.properties_.lvOrder + 10
    }),
    
    //道路高架部--------------------------------------------

    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "road" &&
        f.properties_.ftCode == 2703 &&
        f.properties_.motorway != 1
      ) return f;},
      stroke: new ol.style.Stroke({
        color: roadLColor(rf),
        width: roadLWidth(rf)
      }),
      zIndex: 10000 + rf.properties_.lvOrder + 1
    }),
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "road" &&
        f.properties_.ftCode == 2703 &&
        f.properties_.motorway == 1
      ) return f;},
      stroke: new ol.style.Stroke({
        color: 'rgba(0,151,0,1)',
        width: roadLWidth(rf)
      }),
      zIndex: 10000 + rf.properties_.lvOrder + 1
    }),
    new ol.style.Style({
      //枠線
      geometry: (f) => {if(
        f.properties_.layer == "road" &&
        f.properties_.ftCode == 2703 
      ) return f;},
      stroke: new ol.style.Stroke({
        color: 'rgba(255,255,255,1)',
        width: roadLWidth(rf) + 2,
        lineCap: 'butt'
      }),
      zIndex: 10000 + rf.properties_.lvOrder
    }),
    
    //道路トンネル部--------------------------------------------
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "road" &&
        f.properties_.ftCode == 2704 &&
        f.properties_.motorway != 1
      ) return f;},
      stroke: new ol.style.Stroke({
        color: roadLColor(rf),
        width: roadLWidth(rf),
        lineDash: roadLDash,
        lineCap: 'butt'
      }),
      zIndex: 20000
    }),
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "road" &&
        f.properties_.ftCode == 2704 &&
        f.properties_.motorway == 1
      ) return f;},
      stroke: new ol.style.Stroke({
        color: 'rgba(0,151,0,0.5)',
        width: roadLWidth(rf),
        lineDash: roadLDash,
        lineCap: 'butt'
      }),
      zIndex: 20000
    }),
    
    //鉄道--------------------------------------------
    //通常
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "railway" &&
        ![1,2,3,5,100,300].includes(f.properties_.railState)
      ) return f;},
      stroke: new ol.style.Stroke({
        color: 'rgba(100,100,100,1)',
        width: 1.5
      }),
      zIndex: 1000
    }),
    //高架
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "railway" &&
        f.properties_.railState == 1
      ) return f;},
      stroke: new ol.style.Stroke({
        color: 'rgba(100,100,100,1)',
        width: 1.5
      }),
      zIndex: 10000 + rf.properties_.lvOrder + 1
    }),
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "railway" &&
        f.properties_.railState == 1
      ) return f;},
      stroke: new ol.style.Stroke({
        color: 'rgba(255,255,255,1)',
        width: 4,
        lineCap: 'butt'
      }),
      zIndex: 10000 + rf.properties_.lvOrder
    }),
    //トンネル
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "railway" &&
        [2,3,100,300].includes(f.properties_.railState)
      ) return f;},
      stroke: new ol.style.Stroke({
        color: 'rgba(100,100,100,1)',
        width: 1.5,
        lineDash: [5,5]
      }),
      zIndex: 20000
    }),
    //駅
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "railway" &&
        f.properties_.staCode &&
        f.properties_.staCode != 0
      ) return f;},
      stroke: new ol.style.Stroke({
        color: 'rgba(100,100,100,1)',
        width: 3
      }),
      zIndex: 20000
    }),
    
    
    //注記・記号--------------------------------------------
    //記号
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "symbol" &&
        ![1401,1402,1403,7101,7102,7103].includes(rf.properties_.ftCode)
      ) return f;},
      image: showIcon(rf.properties_.ftCode),
      zIndex: 100002
    }),
    
    //都市名関係
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "symbol" &&
        (f.properties_.name || f.properties_.knj)
      )return f;},
      text: new ol.style.Text({
        text: rf.properties_.name ? rf.properties_.name : rf.properties_.knj,
        textAlign: 'left',
        offsetX: 8,
        offsetY: 0,
        fill: new ol.style.Fill({
          color: 'rgba(50,50,50,1)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255,255,255,1)',
          width: 2
        })
      }),
      image: showIcon(rf.properties_.ftCode),
      zIndex: 100004
    }),
    
    //標高関係
    new ol.style.Style({
      geometry: (f) => {if(
        (f.properties_.layer == "symbol" || f.properties_.layer == "elevation") &&
        f.properties_.alti
      )return f;},
      text: new ol.style.Text({
        text: "" + Math.floor(rf.properties_.alti * 10)/10,
        textAlign: 'left',
        offsetX: 8,
        offsetY: 0,
        fill: new ol.style.Fill({
          color: 'rgba(50,50,50,1)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255,255,255,1)',
          width: 2
        })
      }),
      image: showIcon(rf.properties_.ftCode),
      zIndex: 100003 + 7105 - rf.properties_.ftCode
    }),
    
    //注記一般
    new ol.style.Style({
      geometry: (f) => {if(
        (f.properties_.layer == "label" || f.properties_.layer == "symbol") &&
        f.properties_.knj
      ) return f;},
      text: new ol.style.Text({
        text: rf.properties_.knj,
        fill: new ol.style.Fill({
          color: 'rgba(0,0,0,1)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255,255,255,1)',
          width: 2
        })
      }),
      zIndex: 100000
    }),
    
    //交通関係
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "transp" &&
        f.properties_.knj
      ) return f;},
      text: new ol.style.Text({
        text: rf.properties_.knj,
        fill: new ol.style.Fill({
          color: 'rgba(19,97,69,1)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255,255,255,1)',
          width: 2
        })
      }),
      zIndex: 100001
    }),
    new ol.style.Style({
      geometry: (f) => {if(
        f.properties_.layer == "label" &&
        f.properties_.knj &&
        [422,421,411,412,413,860,441].includes(f.properties_.annoCtg)
      ) return f;},
      text: new ol.style.Text({
        text: rf.properties_.knj,
        fill: new ol.style.Fill({
          color: 'rgba(19,97,69,1)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255,255,255,1)',
          width: 2
        })
      }),
      zIndex: 100002
    }),
    
    
  
  ];

}
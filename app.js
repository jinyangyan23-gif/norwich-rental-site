const listings=[
{id:"gt",title:"Victorian Terrace with Garden",area:"Golden Triangle",type:"2 Bed",price:1280,bedrooms:2,commute:{UEA:13,Station:18},moveIn:"June",amenities:["Furnished","Bike storage","Bills included"],badge:"学生友好",insight:"Golden Triangle 到 UEA 公交和骑行都方便，独立店铺多，适合想兼顾校园和城市生活的人。"},
{id:"city-studio",title:"Market View Studio",area:"City Centre",type:"Studio",price:820,bedrooms:0,commute:{UEA:22,Station:9},moveIn:"Now",amenities:["Furnished","Bills included"],badge:"可立即入住",insight:"City Centre 适合希望步行到商店、餐厅和办公室的人，生活便利但晚间会更热闹。"},
{id:"earlham",title:"Earlham Road House Share",area:"Earlham",type:"House Share",price:620,bedrooms:1,commute:{UEA:8,Station:26},moveIn:"September",amenities:["Furnished","Bike storage","Bills included"],badge:"开学季",insight:"Earlham 靠近 UEA 和公园，合租供应更充足，预算控制会比较从容。"},
{id:"riverside",title:"Riverside Balcony Apartment",area:"Riverside",type:"1 Bed",price:990,bedrooms:1,commute:{UEA:28,Station:5},moveIn:"June",amenities:["Furnished","Pet friendly"],badge:"近火车站",insight:"Riverside 靠近火车站、影院和河岸步道，适合经常出行或喜欢城市夜生活的人。"},
{id:"thorpe",title:"Thorpe Hamlet Maisonette",area:"Thorpe Hamlet",type:"2 Bed",price:1180,bedrooms:2,commute:{UEA:30,Station:11},moveIn:"Now",amenities:["Bike storage","Pet friendly"],badge:"空间充足",insight:"Thorpe Hamlet 安静、住宅感强，去火车站和河边都方便，适合想远离市中心噪音的人。"},
{id:"loft",title:"Cathedral Quarter Loft",area:"City Centre",type:"1 Bed",price:1090,bedrooms:1,commute:{UEA:20,Station:12},moveIn:"September",amenities:["Furnished","Bike storage"],badge:"精品公寓",insight:"市中心老城街区步行体验好，适合重视餐饮、购物和文化活动的人。"}
];
const state={area:"all",budget:9999,type:"all",commute:"all",moveIn:new Set(),amenities:new Set(),saved:new Set()};
const $=(s)=>document.querySelector(s);
const money=(v)=>new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:0}).format(v);

function filtered(){
 const sort=$("#sortSelect").value;
 return listings.filter((x)=>{
  const area=state.area==="all"||x.area===state.area;
  const budget=x.price<=state.budget;
  const type=state.type==="all"||x.type===state.type;
  const move=state.moveIn.size===0||state.moveIn.has(x.moveIn);
  const amenity=state.amenities.size===0||[...state.amenities].every(a=>x.amenities.includes(a));
  const commute=state.commute==="all"||x.commute[state.commute]<=(state.commute==="UEA"?18:12);
  return area&&budget&&type&&move&&amenity&&commute;
 }).sort((a,b)=>{
  if(sort==="priceAsc")return a.price-b.price;
  if(sort==="priceDesc")return b.price-a.price;
  if(sort==="commute"){const target=state.commute==="Station"?"Station":"UEA";return a.commute[target]-b.commute[target];}
  return Number(state.saved.has(b.id))-Number(state.saved.has(a.id))||a.price-b.price;
 });
}

function render(){
 const grid=$("#listingGrid"),items=filtered();
 grid.innerHTML="";
 $("#resultCount").textContent=items.length;
 $("#savedCount").textContent=state.saved.size;
 if(!items.length){grid.innerHTML='<div class="empty">没有找到完全匹配的房源。放宽预算、区域或生活配置后再试一次。</div>';return;}
 items.forEach((x)=>{
  const card=document.createElement("article");
  card.className="card";
  card.innerHTML=`<button class="save ${state.saved.has(x.id)?"is-saved":""}" type="button" aria-label="收藏房源">♡</button>
  <div class="media"><img src="assets/norwich-hero.png" alt="${x.area} 的 ${x.title}"><span class="badge">${x.badge}</span></div>
  <div class="body"><div><p class="area">${x.area} · ${x.type}</p><h3>${x.title}</h3></div><p class="price">${money(x.price)} / 月</p>
  <div class="facts"><span>卧室<b>${x.bedrooms||"Studio"}</b></span><span>到 UEA<b>${x.commute.UEA} min</b></span><span>入住<b>${x.moveIn}</b></span></div>
  <div class="tags">${x.amenities.map(a=>`<span>${a}</span>`).join("")}</div><button class="detail" type="button">查看详情</button></div>`;
  card.querySelector(".save").addEventListener("click",()=>{state.saved.has(x.id)?state.saved.delete(x.id):state.saved.add(x.id);render();});
  card.querySelector(".detail").addEventListener("click",()=>{$("#areaInsight").textContent=x.insight;card.scrollIntoView({behavior:"smooth",block:"center"});});
  grid.append(card);
 });
}

function sync(){state.area=$("#areaFilter").value;state.budget=Number($("#budgetFilter").value);state.type=$("#typeFilter").value;}
$("#searchForm").addEventListener("submit",(e)=>{e.preventDefault();sync();render();$("#listings").scrollIntoView({behavior:"smooth"});});
["#areaFilter","#budgetFilter","#typeFilter","#sortSelect"].forEach(s=>$(s).addEventListener("change",()=>{sync();render();}));
document.querySelectorAll("input[name='moveIn']").forEach(c=>c.addEventListener("change",()=>{c.checked?state.moveIn.add(c.value):state.moveIn.delete(c.value);render();}));
document.querySelectorAll("input[name='amenity']").forEach(c=>c.addEventListener("change",()=>{c.checked?state.amenities.add(c.value):state.amenities.delete(c.value);render();}));
document.querySelectorAll("[data-commute]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-commute]").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.commute=b.dataset.commute;render();}));
$("#resetFilters").addEventListener("click",()=>{state.area="all";state.budget=9999;state.type="all";state.commute="all";state.moveIn.clear();state.amenities.clear();$("#areaFilter").value="all";$("#budgetFilter").value="9999";$("#typeFilter").value="all";$("#sortSelect").value="recommended";document.querySelectorAll("input[type='checkbox']").forEach(c=>c.checked=false);document.querySelectorAll("[data-commute]").forEach(b=>b.classList.toggle("active",b.dataset.commute==="all"));$("#areaInsight").textContent="选择房源或筛选区域后，这里会显示生活便利度、通勤与预算提示。";render();});
$("#savedToggle").addEventListener("click",()=>{$("#areaInsight").textContent=state.saved.size?`已收藏 ${state.saved.size} 套房源。`:"你还没有收藏房源。点击房源右上角按钮即可收藏。";$("#listings").scrollIntoView({behavior:"smooth"});});
$("#tourForm").addEventListener("submit",(e)=>{e.preventDefault();const name=new FormData(e.currentTarget).get("name").toString().trim();$("#formMessage").textContent=`${name}，预约已记录。顾问会按你选择的时间联系你确认房源清单。`;e.currentTarget.reset();});
sync();render();

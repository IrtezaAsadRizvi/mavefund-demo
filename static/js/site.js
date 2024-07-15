const companies=[{key:'AAPL',name:'Apple'},{key:'MSFT',name:'Microsoft'},{key:'AMZN',name:'Amazon'},{key:'GOOGL',name:'Google'},{key:'NFLX',name:'Netflix'},{key:'CNN',name:'CNN'},{key:'TSLA',name:'Tesla'},{key:'V',name:'Visa'},{key:'NVDA',name:'Nvidia'},{key:'WMT',name:'Walmart'},{key:'MA',name:'MasterCard'},{key:'KO',name:'Coca-Cola'},{key:'MCD',name:'McDonald'},{key:'NKE',name:'Nike'},{key:'CSCO',name:'Cisco'},{key:'DIS',name:'Walt Disney'},{key:'SBUX',name:'Starbucks'},{key:'PYPL',name:'PayPal'},];const initPage=async()=>{if(await mavefund.auth.isAuthenticated()){$('#nav-logout-button').show()
$('#nav-login-button').hide()
$('#mobile-nav-logout-button').show()
$('#mobile-nav-login-button').hide()
$('.navbar-nav').append(`
    <li class="nav-item">
      <a class="nav-link" href="profile.html">Profile</a>
    </li>
    `);}}
$(document).ready(function(){document.addEventListener('authLoaded',initPage);$('#nav-toggle-button').click(function(){const target=document.querySelector(".nav-links");target.style.display=target.style.display=="none"?"flex":"none";});$('#nav-login-button').click(function(){mavefund.auth.login();});$('#nav-logout-button').click(function(){mavefund.auth.logout();})
$('#mobile-nav-login-button').click(function(){mavefund.auth.login();});$('#mobile-nav-logout-button').click(function(){mavefund.auth.logout();})
$('#nav-signup-button').click(function(){mavefund.auth.signup();})
mavefund.auth.isAuthenticated().then((result)=>{if(result){$('#nav-logout-button').show();$('#nav-login-button').hide();$('#mobile-nav-logout-button').show();$('#mobile-nav-login-button').hide();}
else{$('#nav-profile-button').click(function(event){event.preventDefault();mavefund.auth.login();});};}).catch((err)=>{console.error(err);});$('#modalSearchForm').submit((e)=>{e.preventDefault();$('#docsearch-list').empty();$.ajax({url:`/api/v1/info/search?q=${$('#searchInput').val().toLowerCase()}`,success:function(res){for(let key in res){if(res[key]){for(let quarterly of[false,true]){let company=`<li class="DocSearch-Hit" id="docsearch-item-0" role="option" aria-selected="true">
              <a class="no-underline" href="financials/${key}/revenue?key=${key}&quarterly=${quarterly}">

                <div class="DocSearch-Hit-Container">
                  <div>
                    <div class="DocSearch-Hit-icon">
                    </div>
                    <div class="DocSearch-Hit-content-wrapper">
                      <span class="DocSearch-Hit-title"><strong>${key}</strong> ${res[key]}</span>
                      <small><em>${quarterly?"Quarterly":"Yearly"}</em></small>
                    </div>
                  </div>
                  <div>
                  
                  </div>
                </div>
              </a>
            </li>`;$('#docsearch-list').append(company);}}}},error:function(err){console.error(err)}})})
$('.premium-btn').click(function(e){e.preventDefault();let type="";switch($(this).data('level')){case 0:type="basic";break;case 1:type="premium";break;case 2:type="super";break;}
dataLayer.push({'event':'pay-button-click','type':type});checkout($(this).data('level'))})
const BASIC_PRICE_ID="price_1MFS3GLGZqgNQZ5xIvlOvBHN";const PREMIUM_PRICE_ID="price_1MFS4MLGZqgNQZ5xHKDBEze7";const SUPER_PRICE_ID="price_1MFS5ILGZqgNQZ5xO4f2sl1Q";async function createCheckoutSession(priceId){console.log('testing create checkout session.');const token=await mavefund.auth.getToken();const response=await fetch("/api/v1/stripe/create_checkout_session",{method:"POST",headers:{"content-type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({priceId:priceId,}),});return await response.json();}
async function checkout(level){const isAuthenticated=await mavefund.auth.isAuthenticated();if(!isAuthenticated){await mavefund.auth.login("https://mavefund.com");}
console.log('testing create checkout session.');let session;switch(level){case 0:session=await createCheckoutSession(BASIC_PRICE_ID);break;case 1:session=await createCheckoutSession(PREMIUM_PRICE_ID);break;case 2:session=await createCheckoutSession(SUPER_PRICE_ID);break;default:alert("what are you trying to do exactly??? 🤨🤨🤨");break;}
if(session.status==="success"){window.location.href=session.url;}else{if(session.detail==='Unauthenticated'){mavefund.auth.login()}else{const toast=new bootstrap.Toast(document.getElementById('liveToastBtn2'));toast.show();}}}})
let graphTimeoutId;let delay=5;function removeGraph(){clearTimeout(graphTimeoutId);floatingGraph=document.querySelector(".floating-div");floatingArrow=document.querySelector(".arrow-div");if(floatingArrow!==null&&floatingGraph!==null){floatingArrow.remove();floatingGraph.remove();}}
function getValidMonths(latest){const prev=curr=>(curr+12-1)%12+1
const a=latest
const b=prev(latest-1)
const c=prev(b-1)
return[String(a).padStart(2,'0'),String(b).padStart(2,'0'),String(c).padStart(2,'0')]}
function addGraph(event,ticker,company_name,close,change_per,date){ticker=ticker.toUpperCase();let url=new URL("https://mavefund.com/api/v1/info/companyprice");url.searchParams.set("ticker",ticker);fetch(url).then((response)=>response.json()).then((data)=>{const validMonths=getValidMonths(Number(data[0].x.slice(5,7)))
data=data.filter(item=>validMonths.includes(item.x.slice(5,7)))
floatingGraph=document.querySelector(".floating-div");floatingArrow=document.querySelector(".arrow-div");if(floatingArrow!==null&&floatingGraph!==null){floatingArrow.remove();floatingGraph.remove();}
let $floatingDiv=$("<div>").addClass("floating-div").appendTo("body");let $arrowDiv=$("<div>").addClass("arrow-div").appendTo("body");var closeColor=null;if(parseFloat(change_per)>0){closeColor="#00a449";subtitleText=close+' ('+change_per+'%)';}
else if(parseFloat(change_per)===0){closeColor="#929CB3";subtitleText=close+' ('+change_per+'%)';}
else{closeColor="#fb5058";subtitleText=close+' ('+change_per+'%)';}
var options={series:[{data:data}],grid:{show:true,borderColor:'#363a46',strokeDashArray:5,position:'back',xaxis:{lines:{show:true,}},yaxis:{lines:{show:true,}},},chart:{type:"candlestick",height:220,width:380,toolbar:{show:false,},animations:{enabled:false}},title:{text:ticker,align:"left",style:{color:"#929cb3",fontSize:"20px",fontWeight:700}},xaxis:{type:"datetime",tickPlacement:"between",labels:{format:"MMM",showDuplicates:false,style:{cssClass:"white-label",colors:"#929cb3"}},axisBorder:{show:true,color:'#363a46',},axisTicks:{show:false},title:{text:date,offsetX:150,offsetY:-190,style:{color:undefined,fontSize:'12px',fontFamily:'"Inter", sans-serif !important',fontWeight:400,cssClass:'apexcharts-xaxis-title',color:"#929cb3"},}},yaxis:{opposite:"true",decimalsInFloat:2,tooltip:{enabled:false,},labels:{style:{colors:["#929cb3"],}},axisBorder:{show:true,color:'#363a46',},title:{text:"DAILY",rotate:90,offsetX:-365,offsetY:-30,style:{color:"#929cb3",fontSize:'12px',fontWeight:700,fontFamily:'"Inter", sans-serif !important',},}},noData:{text:"No data available for this stock",},subtitle:{text:subtitleText,align:'left',floating:false,style:{fontSize:'18px',fontWeight:'600',fontFamily:'"Inter", sans-serif !important',color:closeColor,cssClass:"candlestickSubtitle",}}};var chart=new ApexCharts(document.querySelector(".floating-div"),options);chart.render();$floatingDiv.css({backgroundColor:"#22262f",position:"absolute",left:event.pageX+40,top:event.pageY-90,overflow:"auto",foreColor:'#ffffff',height:"255px"});$arrowDiv.css({position:"absolute",left:event.pageX+15,top:event.pageY+5,marginTop:"-10px",borderTop:"10px solid transparent",borderBottom:"10px solid transparent",borderRight:"10px solid #4ecca3",});const node=document.createElement("span");const textnode=document.createTextNode(company_name);node.style.color="#929CB3";node.appendChild(textnode);node.className='candleStickCompanyName';document.getElementsByClassName("floating-div")[0].appendChild(node);});}
function arrayMax(collection){let max=collection[0];let n=collection.length;let i=0
for(;i<n;++i){if(collection[i]!==null){max=collection[i++]
break}}
for(;i<n;++i){if(collection[i]!==null&&collection[i]>max){max=collection[i];}}
return max;}
function arrayMin(collection){let min=collection[0];let n=collection.length;let i=0
for(;i<n;++i){if(collection[i]!==null){min=collection[i++]
break}}
for(;i<n;++i){if(collection[i]!==null&&collection[i]<min){min=collection[i];}}
return min;}
function getColorBasedOnValue(value){if(value>0)
return "green"
else if(value<0)
return "red"
return "white"}
function getGraph(event,ticker,company_name,close,change_per,date){clearTimeout(graphTimeoutId);graphTimeoutId=setTimeout(()=>{addGraph(event,ticker,company_name,close,change_per,date);},delay);}
function isInteger(value){return typeof value==='number'&&Number.isFinite(value)&&Math.floor(value)===value;}
function limitDecimalPlaces(x,limit=2){if(x==='-')return 0
if(isInteger(x))return x
return x.toFixed(limit).replace(/([0-9]+(\.[0-9]{limit})?)(\.?0+$)/,'$1')}
const tickerMapper={"^IXIC":"NASDAQ","^DJI":"DOW","^GSPC":"S&P500","^NSEI":"NIFTY 50","^N225":"Nikkei 225","000001.ss":"Shanghai","CL=F":"Crude Oil","GC=F":"Gold","^GSPTSE":"S&P/TSX","^GDAXI":"DAX","^FCHI":"CAC 40","^FTSE":"FTSE100","^HSI":"Hang Seng","^STI":"Singapore","^MXX":"Mexico","FVTT.FGI":"FTSE Vietnam Index",};const getTicketName=(name)=>{if(tickerMapper[name]){return tickerMapper[name];}
else return name;}
async function updateTopTickers(){$.get("https://mavefund.com/api/v1/market/summary",(data,status)=>{const parent=document.getElementById("nav-tickers");const parent2=document.getElementById("nav-tickers-copy");const tickers={};data.forEach(item=>{if(!tickers.hasOwnProperty(item.ticker))tickers[item.ticker]=[]
tickers[item.ticker].push(item.close)})
for(let x=0;x<1;x++){data.forEach(({ticker,growth_percentage})=>{const previous_element=document.getElementById(`${getTicketName(ticker)}_1`)
if(previous_element){previous_element.remove();}
parent.insertAdjacentHTML("beforeend",`<div id="${getTicketName(ticker)}_1" class="nav-ticker">${getTicketName(ticker)}<span class="${getColorBasedOnValue(growth_percentage)}">${limitDecimalPlaces(growth_percentage,2)}%</span></div>`)})
data.forEach(({ticker,growth_percentage})=>{const previous_element=document.getElementById(`${getTicketName(ticker)}_2`)
if(previous_element){previous_element.remove();}
parent2.insertAdjacentHTML("beforeend",`<div id="${getTicketName(ticker)}_2" class="nav-ticker">${getTicketName(ticker)}<span class="${getColorBasedOnValue(growth_percentage)}">${limitDecimalPlaces(growth_percentage,2)}%</span></div>`)})}
parent.style.minWidth=`${Math.max(parent.clientWidth,document.body.offsetWidth)}px`;parent2.style.minWidth=`${Math.max(parent.clientWidth,document.body.offsetWidth)}px`;});setTimeout(updateTopTickers,30000);}
updateTopTickers();window.onresize=function(event){const parent=document.getElementById("nav-tickers");const parent2=document.getElementById("nav-tickers-copy");parent.style.minWidth=`${Math.max(parent.clientWidth,document.body.offsetWidth)}px`;parent2.style.minWidth=`${Math.max(parent.clientWidth,document.body.offsetWidth)}px`;};async function hover_effect_and_(element,isMobile){const textContainer=element;const original_text=textContainer.innerText;element.setAttribute('data-hover-text',original_text);if(isMobile){const mobileMaxLength=element.getAttribute('mobile-data-max-length');if(mobileMaxLength&&mobileMaxLength>original_text.length){textContainer.innerText=original_text;}else{const truncatedText=textContainer.innerText.slice(0,mobileMaxLength)+'...';textContainer.innerText=truncatedText;}}else{const computerMaxLength=element.getAttribute('data-max-length');if(computerMaxLength&&computerMaxLength>original_text.length){textContainer.innerText=original_text;}else{const truncatedText=textContainer.innerText.slice(0,computerMaxLength)+'...';textContainer.innerText=truncatedText;}}}
async function isMobileDevice(){return window.innerWidth<768;}
const hoverTdElements=document.querySelectorAll('.hover-td');const isMobile=isMobileDevice();
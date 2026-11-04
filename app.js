const view=document.querySelector('#view');
const tabs=[...document.querySelectorAll('.tab')];
const now = new Date();
const monthLabel = now.toLocaleDateString('en-CA',{month:'long',year:'numeric'});
const shortMonth = now.toLocaleDateString('en-CA',{month:'short'});
const isSeedMonth = now.getFullYear()===2026 && now.getMonth()===10;
const data=[
 {name:'Rent',target:750,funded:isSeedMonth?100:0,icon:'⌂'},
 {name:'Insurance',target:309.23,funded:isSeedMonth?154:0,icon:'◈'},
 {name:'Phone',target:110,funded:0,icon:'▣'},
 {name:'Subscriptions',target:null,funded:0,icon:'◌'},
 {name:'Salem',target:60,funded:0,icon:'✦'},
 {name:'Gas',target:75,funded:0,icon:'↗'},
 {name:'Groceries',target:250,funded:0,icon:'◇'}
];
const bills=[{name:'Rent',date:`${shortMonth} 1`,amount:750},{name:'Insurance',date:`${shortMonth} 19`,amount:309.23},{name:'Phone',date:'Monthly',amount:110}];
const money=n=>n.toLocaleString('en-CA',{style:'currency',currency:'CAD'});
const targetTotal=1704.23;
const fundedTotal=data.reduce((sum,item)=>sum+item.funded,0);
document.title=`${monthLabel} Budget · Dashboard`;
document.querySelector('.month-control').innerHTML=`<span class="live-dot"></span> ${monthLabel.toUpperCase()} <span class="chevron">⌄</span>`;
document.querySelector('.hero h1').innerHTML=`${monthLabel}<span class="period">.</span>`;

function card(title,content,cls=''){return `<article class="card ${cls}"><h3 class="card-title">${title}</h3>${content}</article>`}
function fundingRows(){return data.map(x=>`<div class="fund-row"><div class="category"><span class="icon">${x.icon}</span><div><div class="fund-name">${x.name}</div><div class="small">${x.target===null?'Target not set':money(x.target)+' monthly target'}</div></div></div><div class="fund-value">${money(x.funded)}</div><button class="btn" data-fund="${x.name}">Details</button></div>`).join('')}
function home(){return `<div class="grid">
${card('Monthly funding',`<div class="big-number">${money(fundedTotal)}</div><div class="subline">funded toward ${money(targetTotal)}</div><div class="progress"><span style="width:${fundedTotal/targetTotal*100}%"></span></div><div class="progress-label"><span>Monthly progress</span><b>${(fundedTotal/targetTotal*100).toFixed(1)}%</b></div>`,'wide')}
${card('Weekly allowance',`<div class="big-number">$150</div><div class="subline">planned spending limit</div><div style="margin-top:18px"><button class="btn" data-goto="spending">Open spending tracker ↗</button></div>`)}
${card('Current funding',`<div class="line-item"><span>Rent</span><strong>$100 / $750</strong></div><div class="line-item"><span>Insurance</span><strong>$154 / $309.23</strong></div><div class="line-item"><span>Phone</span><strong>$0 / $110</strong></div><div style="margin-top:14px"><button class="btn" data-goto="funding">View full list ↗</button></div>`,'wide')}
${card('Next bill',`<div class="category"><span class="icon">◈</span><div><strong>Insurance</strong><div class="small">Due ${shortMonth} 19</div></div></div><div class="big-number" style="font-size:25px;margin-top:15px">$309.23</div><div style="margin-top:12px"><button class="btn" data-goto="bills">View bills ↗</button></div>`)}
${card('Accounts & goals',`<div class="line-item"><span>Visa availability goal</span><strong>$2,500</strong></div><div class="line-item"><span>Mastercard availability goal</span><strong>$2,500</strong></div><div class="subline" style="margin-top:12px">Balances kept off the overview.</div>`)}
</div>`}
function funding(){return `<div class="grid">${card('Monthly funding',`<div class="table-head"><span>Category</span><span style="text-align:right">Funded</span><span style="text-align:right">Action</span></div>${fundingRows()}<div class="line-item"><strong>Total funded</strong><strong>${money(fundedTotal)}</strong></div>`,'wide')}${card('Funding summary',`<div class="big-number">${money(targetTotal-fundedTotal)}</div><div class="subline">remaining to fund this month</div><div class="progress"><span style="width:${fundedTotal/targetTotal*100}%"></span></div><div class="progress-label"><span>Funded</span><b>${(fundedTotal/targetTotal*100).toFixed(1)}%</b></div><p class="subline">Subscription target is not set.</p>`)}</div>`}
function spending(){return `<div class="grid">${card('Weekly spending plan',`<div class="big-number">$150</div><div class="subline">weekly allowance</div><form id="spend-form" style="margin-top:18px;display:grid;gap:10px"><input class="field" id="spend-amount" type="number" min="0" step=".01" placeholder="Purchase amount"><input class="field" id="spend-note" placeholder="What was it for?"><button class="btn primary">Add purchase to preview</button></form><div id="spend-result"></div>`,'wide')}${card('Spending snapshot',`<div class="subline">No purchases added yet in this preview.</div><div class="line-item"><span>Weekly limit</span><strong>$150.00</strong></div>`)}</div>`}
function billsView(){return `<div class="grid">${card('Bills & due dates',bills.map(b=>`<div class="line-item"><div><strong>${b.name}</strong><div class="bill-date">${b.date}</div></div><strong>${money(b.amount)}</strong></div>`).join(''),'wide')}${card('Upcoming',`<div class="big-number">${shortMonth} 19</div><div class="subline">Insurance · ${money(309.23)}</div>`)}</div>`}
function accounts(){return `<div class="grid">${card('Accounts & goals',`<div class="line-item"><span>Visa available goal</span><strong>$2,500</strong></div><div class="line-item"><span>Mastercard available goal</span><strong>$2,500</strong></div><p class="subline">Current account balances are intentionally not shown on this dashboard.</p>`,'wide')}${card('Savings focus',`<div class="subline">Keep rent and insurance funded first, then build toward your card availability goals.</div>`)}</div>`}
const renderers={home,funding,spending,bills:billsView,accounts};
function render(tab='home'){view.innerHTML=renderers[tab]();tabs.forEach(t=>t.classList.toggle('active',t.dataset.tab===tab));view.querySelectorAll('[data-goto]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.goto)));view.querySelectorAll('[data-fund]').forEach(b=>b.addEventListener('click',()=>{const x=data.find(d=>d.name===b.dataset.fund);b.textContent=x.target===null?'Target not set':`${money(x.funded)} funded · ${money(x.target)} target`;b.classList.toggle('primary')}));const form=view.querySelector('#spend-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();const amount=Number(view.querySelector('#spend-amount').value);const note=view.querySelector('#spend-note').value||'Purchase';view.querySelector('#spend-result').innerHTML=`<div class="line-item"><span>${note}</span><strong>${money(amount)}</strong></div><div class="subline">Preview only — this does not save data.</div>`})}
tabs.forEach(t=>t.addEventListener('click',()=>render(t.dataset.tab)));render();

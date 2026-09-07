"use client";

import { useEffect, useMemo, useState } from "react";

type Campaign = {
  id: string;
  category: string;
  title: string;
  name: string;
  location: string;
  description: string;
  use: string;
  raised: number;
  goal: number;
  supporters: number;
  image: string;
  verified: boolean;
  flagship?: boolean;
  update: string;
};

const campaigns: Campaign[] = [
  { id:"kente", category:"Fashion & Trading", title:"Kente accessories for students", name:"Akosua Boateng", location:"Cape Coast, Ghana", description:"A UCC student selling handmade kente accessories on campus. She is raising starting stock and a stall fee to move from selling out of a backpack to a proper table.", use:"GHS 800 fabric & materials · GHS 400 first market stall fee", raised:780, goal:1200, supporters:34, image:"/images/kente.svg", verified:true, flagship:true, update:"We have reached 65% of our goal and are preparing our next batch of handmade pieces." },
  { id:"repair", category:"Services", title:"Mobile phone repair kiosk", name:"Kwabena Owusu", location:"Kumasi, Ghana", description:"A self-taught phone repair technician looking to set up a fixed kiosk near a busy market instead of working door-to-door.", use:"GHS 2,000 tools & parts · GHS 1,500 kiosk rental deposit", raised:1900, goal:3500, supporters:51, image:"/images/repair.svg", verified:true, update:"The first equipment purchase is ready once the campaign crosses the next milestone." },
  { id:"waakye", category:"Food & Delivery", title:"Waakye delivery service", name:"Efua Mensah", location:"Accra, Ghana", description:"A small home-based waakye business adding delivery so students and workers who cannot leave campus can still order.", use:"GHS 600 cooking equipment · GHS 300 delivery fuel fund", raised:900, goal:900, supporters:28, image:"/images/waakye.svg", verified:true, flagship:true, update:"Fully funded! The business is now serving more customers with its new delivery routine." },
  { id:"solar", category:"Agriculture", title:"Solar irrigation for a vegetable farm", name:"Kofi Asare", location:"Eastern Region, Ghana", description:"A young farmer wants to reduce fuel costs and keep a small vegetable plot productive during dry periods with a solar-powered irrigation setup.", use:"GHS 1,450 solar pump · GHS 550 pipes & storage", raised:1120, goal:2000, supporters:22, image:"/images/farm.svg", verified:false, update:"The farmer has secured the water tank and is raising the final amount for the solar pump." },
  { id:"design", category:"Technology", title:"Campus design & print studio", name:"Nana Yeboah", location:"Cape Coast, Ghana", description:"A student designer building a compact print and design service for clubs, student entrepreneurs and local events.", use:"GHS 1,200 printer · GHS 700 materials & workspace", raised:1340, goal:1900, supporters:37, image:"/images/design.svg", verified:true, update:"The campaign is 71% funded and has already received its first bulk printing request." },
  { id:"snacks", category:"Food & Trading", title:"Healthy snack packs for students", name:"Abena Ofori", location:"Takoradi, Ghana", description:"Affordable snack packs made from locally sourced ingredients, designed for students who need quick food between classes.", use:"GHS 600 ingredients · GHS 450 packaging · GHS 250 delivery", raised:520, goal:1300, supporters:16, image:"/images/snacks.svg", verified:false, update:"New sample packs are being tested with students before the next production run." }
];

const supporters = [
  ["Nana B.","Sponsor",6,2400],["Kojo Mensah","Investor",4,1600],["Priscilla O.","Supporter",3,950],["Yaw A.","Supporter",5,700]
] as const;

const defaultImpact = { entrepreneurs_funded:342, support_mobilized:342000, supporters:1200, average_progress:78 };
const defaultFaqs = [
  {question:"Who can create a campaign?",answer:"Young entrepreneurs, students and micro-business owners can submit a business pitch. Campaigns are reviewed by the Peer Pockets administrator before publication."},
  {question:"How does support work?",answer:"Supporters choose a campaign and amount. The final production flow will use a secure Mobile Money Request-to-Pay provider so the payer receives a prompt on their own phone."},
  {question:"What does “Verified” mean?",answer:"A verification badge means the relevant identity and campaign information has passed the platform's review process. It should never be treated as a guarantee of business success."},
  {question:"Can I report a campaign?",answer:"Yes. Suspicious or misleading campaigns can be reported so concerns can be reviewed by the administrator and appropriate action can be taken."}
];

const categories = ["All","Fashion & Trading","Services","Food & Delivery","Agriculture","Technology"];

export default function Home() {
  const [modal, setModal] = useState<"support"|"pitch"|"campaign"|null>(null);
  const [selected, setSelected] = useState<Campaign|null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [notice, setNotice] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentState, setPaymentState] = useState<"idle"|"waiting"|"success">("idle");
  const [senderNetwork, setSenderNetwork] = useState("MTN Mobile Money");
  const [dbReady, setDbReady] = useState(false);
  const [liveCampaigns, setLiveCampaigns] = useState<Campaign[]>(campaigns);
  const [liveSupporters, setLiveSupporters] = useState<any[]>([...supporters]);
  const [siteContent, setSiteContent] = useState<any>({settings:{},faqs:[]});
  const [pitchSending, setPitchSending] = useState(false);
  useEffect(() => {
    Promise.all([fetch("/api/campaigns"),fetch("/api/site")]).then(async([campaignResponse,siteResponse])=>{
      const campaignData=campaignResponse.ok?await campaignResponse.json():null;
      const siteData=siteResponse.ok?await siteResponse.json():null;
      if(campaignData?.campaigns?.length){setDbReady(true);setLiveCampaigns(campaignData.campaigns.map((c:any)=>({...c,name:c.entrepreneur_name,image:c.image_url||c.image||"/images/hero.svg",flagship:c.featured,update:c.latest_update||""})));}
      if(siteData)setSiteContent(siteData);
      if(siteData?.supporters?.length)setLiveSupporters(siteData.supporters.map((s:any)=>[s.display_name||"Anonymous supporter","Supporter",s.campaigns_supported||0,Number(s.total_supported||0)]));
    }).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = liveCampaigns.filter(c => (category === "All" || c.category === category) && (!q || `${c.title} ${c.name} ${c.location} ${c.category}`.toLowerCase().includes(q)));
    return [...list].sort((a,b) => sort === "newest" ? b.id.localeCompare(a.id) : sort === "almost" ? (b.raised/b.goal)-(a.raised/a.goal) : sort === "most" ? b.supporters-a.supporters : (Number(b.flagship)-Number(a.flagship)) || (b.raised/b.goal)-(a.raised/a.goal));
  }, [liveCampaigns, search, category, sort]);
  const impact = {...defaultImpact,...(siteContent.settings?.impact||{})};
  const platform = siteContent.settings?.platform||{};
  const faqs = siteContent.faqs?.length ? siteContent.faqs : defaultFaqs;

  function openCampaign(c: Campaign) { setSelected(c); setModal("campaign"); }
  function openSupport(c: Campaign) { setSelected(c); setAmount(""); setPhone(""); setPaymentReference(""); setNotice(""); setPaymentState("idle"); setModal("support"); }
  function beginPayment() {
    const value = Number(amount);
    if (!selected || !value || value < 1 || !phone.trim()) { setNotice("Enter a valid amount and your Mobile Money number."); return; }
    setPaymentState("waiting");
    setNotice(`Payment details ready. For now, send GHS ${amount} to ${platform.momo_number||"050 012 6026"}, then enter your transaction/reference number below.`);
  }
  async function confirmPayment() {
    if (!paymentReference.trim()) { setNotice("Enter the transaction/reference number."); return; }
    try {
      const r = await fetch("/api/payments", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({campaign_id:selected?.id, amount:Number(amount), phone, network:senderNetwork, provider_reference:paymentReference})});
      if (!r.ok) throw new Error();
      setPaymentState("success"); setNotice("Payment confirmation submitted for admin verification.");
    } catch { setNotice("We could not save the payment confirmation. Please try again."); }
  }
  async function submitPitch(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setPitchSending(true); const form = new FormData(e.currentTarget); try { const r = await fetch("/api/pitches", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ title:form.get("title"), entrepreneur_name:form.get("name"), category:form.get("category"), goal:form.get("goal"), story:form.get("story"), use_of_funds:form.get("use"), location:form.get("location") }) }); if (!r.ok) throw new Error(); setModal(null); setNotice("Your pitch has been submitted for admin review."); } catch { setNotice("The pitch form is ready, but the database must be connected in Render before submissions can be saved."); } finally { setPitchSending(false); } }

  return <main id="top">
    <header className="nav">
      <a href="#top" className="brand"><img src="/images/logo.svg" alt=""/><span>Peer Pockets</span></a>
      <nav className="nav-links"><a href="#discover">Discover</a><a href="#how-it-works">How it works</a><a href="#trust">Trust & safety</a><a href="#impact">Our impact</a></nav>
      <div className="nav-actions"><button className="pitch-btn" onClick={() => setModal("pitch")}>Pitch your business</button></div>
    </header>

    <section className="hero page-pad">
      <div className="hero-grid">
        <div><div className="eyebrow">Ghana's community-powered business platform</div><h1>Small capital.<br/><span>Real businesses.</span></h1><p className="hero-copy">We believe good businesses shouldn't fail because they started small. Peer Pockets connects young, student, and micro entrepreneurs with supporters who fund a clear next step.</p><div className="hero-actions"><a className="primary-link" href="#discover">Discover businesses <span>→</span></a><button className="secondary-link" onClick={() => setModal("pitch")}>Start a pitch</button></div><div className="trust-row"><span>✓ Clear funding goals</span><span>✓ Verified campaigns</span><span>✓ Ghana-focused</span></div></div>
        <div className="hero-art"><img src="/images/hero.svg" alt="Young entrepreneurs growing businesses with community support"/><div className="hero-floating"><strong>GHS 342K+</strong><span>community support pledged</span></div></div>
      </div>
      <div className="program"><div><div className="gold">Flagship programme</div><h2>GHS 1,000 to 1,000 Entrepreneurs</h2><p>Support a cohort of young entrepreneurs with practical starting capital.</p></div><div className="program-stat"><strong>{impact.entrepreneurs_funded.toLocaleString()} / 1000</strong><span>entrepreneurs funded</span></div><div className="program-bar"><i style={{width:`${Math.min(100,Number(impact.entrepreneurs_funded)/10)}%`}}/></div></div>
    </section>

    <section id="how-it-works" className="section light-section page-pad"><div className="section-heading"><div><div className="eyebrow">Simple by design</div><h2 className="section-title">From an idea to a funded business</h2></div><p className="section-subtitle">A straightforward way for entrepreneurs to ask for what they need — and for supporters to back something tangible.</p></div><div className="steps"><div className="step"><div className="step-number">01</div><h3>Tell your story</h3><p>Share your business idea, funding goal, photos, and exactly what the money will buy.</p></div><div className="step"><div className="step-number">02</div><h3>Get discovered</h3><p>Your pitch is reviewed and presented clearly so supporters can understand the opportunity.</p></div><div className="step"><div className="step-number">03</div><h3>Receive support</h3><p>Supporters contribute through Mobile Money, with transaction verification built into the final payment flow.</p></div></div></section>

    <section id="discover" className="section page-pad"><div className="discover-head"><div><div className="eyebrow">Discover & support</div><h2 className="section-title">Businesses raising support now</h2><p className="section-subtitle">Find a business you believe in and help move it to its next milestone.</p></div><span className="live-pill"><i/> Live pitches</span></div><div className="discover-tools"><label className="search-box">⌕<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search businesses, entrepreneurs or locations"/></label><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="almost">Almost funded</option><option value="most">Most supported</option><option value="newest">Newest</option></select></div><div className="category-pills">{categories.map(c=><button className={category===c?"active":""} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div>
      <div className="cards">{filtered.map(c=><article className="card" key={c.id}><button className="card-image" onClick={()=>openCampaign(c)}><img src={c.image} alt={c.title}/><span className="image-overlay"><span className="category">{c.category}</span>{c.flagship&&<span className="tag">Flagship</span>}</span></button><div className="card-body"><div className="verified-line">{c.verified?<span>✓ Verified campaign</span>:<span className="pending">Review in progress</span>}<span>{c.location}</span></div><h3>{c.title}</h3><div className="name">{c.name}</div><p className="description">{c.description}</p><p className="use"><em>Use of funds: {c.use}</em></p><div className="progress"><i style={{width:`${Math.min(100,Math.round(c.raised/c.goal*100))}%`}}/></div><div className="raised"><strong>GHS {c.raised.toLocaleString()}</strong> of GHS {c.goal.toLocaleString()} <span>· {Math.min(100,Math.round(c.raised/c.goal*100))}%</span></div><div className="supporters-count">{c.supporters} supporters</div><button className="support-btn" onClick={()=>openSupport(c)}>{c.raised>=c.goal?"Support the business":"Support this business"} <span>→</span></button></div></article>)}</div>{filtered.length===0&&<div className="empty">No campaigns match your search yet. Try another category or search term.</div>}</section>

    <section id="supporters" className="supporters-section page-pad"><div className="section-heading"><div><div className="eyebrow">Community</div><h2 className="section-title">People backing real businesses</h2></div><p className="section-subtitle">Supporters help entrepreneurs move from a good idea to a practical next step.</p></div><div className="supporter-table">{liveSupporters.map((s,i)=><div className="supporter-row" key={s[0]}><div className="rank">{String(i+1).padStart(2,"0")}</div><div className="avatar">{s[0].charAt(0)}</div><div className="supporter-info"><div className="supporter-name">{s[0]}</div><div className="supporter-meta">{s[1]} · backed {s[2]} entrepreneurs</div></div><div className="supporter-total">GHS {s[3].toLocaleString()}</div></div>)}</div></section>

    <section id="trust" className="trust-section page-pad"><div className="trust-copy"><div className="eyebrow">Trust is part of the product</div><h2 className="section-title">Know what your support is funding.</h2><p>Every campaign is designed around a clear goal, an itemized use of funds, and a public progress trail. Verification badges are reserved for campaigns that have passed the relevant review.</p><div className="trust-grid"><div><b>✓ Identity review</b><span>Entrepreneur details can be checked before publication.</span></div><div><b>✓ Business review</b><span>Campaign information and funding purpose are reviewed.</span></div><div><b>✓ Transaction records</b><span>Support activity can be matched to payment references.</span></div><div><b>✓ Report a concern</b><span>Supporters can flag a campaign for admin review.</span></div></div></div><div className="trust-card"><div className="shield">✓</div><h3>How Peer Pockets protects supporters</h3><ul><li>Clear funding goals</li><li>Itemized funding requests</li><li>Campaign review before publication</li><li>Payment confirmation and records</li><li>Admin oversight of the platform</li></ul></div></section>

    <section id="impact" className="section light-section page-pad"><div className="section-heading"><div><div className="eyebrow">Community impact</div><h2 className="section-title">Small contributions can move real businesses.</h2></div><p className="section-subtitle">Our impact dashboard is designed to show where the community is putting its support.</p></div><div className="impact-grid"><div><strong>{Number(impact.entrepreneurs_funded).toLocaleString()}+</strong><span>entrepreneurs funded</span></div><div><strong>GHS {Number(impact.support_mobilized).toLocaleString()}+</strong><span>support mobilized</span></div><div><strong>{Number(impact.supporters).toLocaleString()}+</strong><span>supporters engaged</span></div><div><strong>{Number(impact.average_progress)}%</strong><span>campaign progress average</span></div></div></section>

    <section className="stories section page-pad"><div className="section-heading"><div><div className="eyebrow">Community stories</div><h2 className="section-title">Why people choose to support</h2></div><p className="section-subtitle">A professional platform should make the human impact visible, not just the numbers.</p></div><div className="story-grid"><blockquote>“I wanted to support something I could understand. Seeing exactly what the money was for made the decision easy.”<footer>— Peer Pockets supporter</footer></blockquote><blockquote>“The campaign helped me explain my next step clearly instead of simply asking people for money.”<footer>— Young entrepreneur</footer></blockquote><blockquote>“The progress updates make it feel like you're building the business together.”<footer>— Community member</footer></blockquote></div></section>

    <section id="faq" className="section page-pad faq-section"><div className="section-heading"><div><div className="eyebrow">Questions</div><h2 className="section-title">Frequently asked questions</h2></div><p className="section-subtitle">A clear platform should make the important details easy to understand.</p></div><div className="faq-grid">{faqs.map((faq:any)=><details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>

    <section className="cta-section page-pad"><div><div className="gold">For entrepreneurs</div><h2>Have a business that deserves a chance?</h2><p>Put a clear number behind your next step and let the community help you move.</p></div><button className="light-btn" onClick={()=>setModal("pitch")}>Pitch your business →</button></section>

    <footer className="footer"><div className="footer-main"><div className="footer-brand"><a href="#top" className="brand"><img src="/images/logo.svg" alt=""/><span>{platform.name||"Peer Pockets"}</span></a><p>Small capital. Real businesses. A Ghana-focused community for young and micro entrepreneurs.</p><div className="footer-badges"><span>Ghana-focused</span><span>Community-powered</span></div></div><div className="footer-col"><h4>Explore</h4><a href="#discover">Businesses</a><a href="#supporters">Top supporters</a><a href="#how-it-works">How it works</a><a href="#impact">Our impact</a></div><div className="footer-col"><h4>For entrepreneurs</h4><button onClick={()=>setModal("pitch")}>Pitch your business</button><a href="#how-it-works">Funding guide</a><a href="#trust">Campaign guidelines</a></div><div className="footer-col"><h4>Support</h4><a href={`mailto:${platform.support_email||"hello@peerpockets.com"}`}>{platform.support_email||"hello@peerpockets.com"}</a><a href="#faq">FAQs</a><a className="admin-footer-link" href="/admin">Admin login →</a><span>{platform.country||"Ghana"}</span></div></div><div className="footer-bottom"><span>© 2026 Peer Pockets. All rights reserved.</span><span>Terms · Privacy · Refund policy · Responsible funding</span></div></footer>

    {notice&&<div className="toast">{notice}<button onClick={()=>setNotice("")}>×</button></div>}
    {modal==="pitch"&&<div className="overlay"><div className="modal"><button className="close" onClick={()=>setModal(null)}>×</button><div className="eyebrow">Start a campaign</div><h2>Pitch your business</h2><p>Tell us what you are building, what you need, and how the funding will be used. Submissions go to admin review before publication.</p><form onSubmit={submitPitch}><label>Business / campaign title<input name="title" required placeholder="e.g. Campus printing studio"/></label><label>Your name<input name="name" required placeholder="Full name"/></label><label>Location<input name="location" placeholder="e.g. Cape Coast, Ghana"/></label><label>Category<select name="category"><option>Technology</option><option>Food & Delivery</option><option>Fashion & Trading</option><option>Services</option><option>Agriculture</option></select></label><label>Funding goal (GHS)<input name="goal" required type="number" min="1" placeholder="2000"/></label><label>Business story<textarea name="story" required rows={4} placeholder="What are you building and why does it matter?"/></label><label>Use of funds<textarea name="use" required rows={3} placeholder="Break the goal into practical items."/></label><button className="support-btn" type="submit" disabled={pitchSending}>{pitchSending ? "Submitting…" : "Submit for review →"}</button></form></div></div>}
    {modal==="campaign"&&selected&&<div className="overlay"><div className="modal campaign-modal"><button className="close" onClick={()=>setModal(null)}>×</button><img className="detail-image" src={selected.image} alt=""/><div className="eyebrow">{selected.category}</div><h2>{selected.title}</h2><div className="detail-by">{selected.name} · {selected.location} {selected.verified&&<span>✓ Verified</span>}</div><p>{selected.description}</p><div className="detail-stats"><div><strong>GHS {selected.raised.toLocaleString()}</strong><span>raised</span></div><div><strong>GHS {selected.goal.toLocaleString()}</strong><span>goal</span></div><div><strong>{selected.supporters}</strong><span>supporters</span></div></div><div className="detail-box"><b>What the funding will do</b><p>{selected.use}</p></div><div className="detail-box"><b>Latest update</b><p>{selected.update}</p></div><button className="support-btn" onClick={()=>openSupport(selected)}>Support this business →</button></div></div>}
    {modal==="support"&&selected&&<div className="overlay"><div className="modal"><button className="close" onClick={()=>setModal(null)}>×</button><div className="eyebrow">Support {selected.name}</div><h2>{selected.title}</h2><p>Enter the amount and your Mobile Money number. For now, send the contribution to Peer Pockets's Mobile Money number below. We will replace this with automatic Request-to-Pay when the payment provider is connected.</p><label>Support amount (GHS)<input type="number" min="1" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="100"/></label><div className="amounts">{[50,100,200,500].map(v=><button key={v} onClick={()=>setAmount(String(v))}>GHS {v}</button>)}</div><label>Your Mobile Money number<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="024 XXX XXXX"/></label><div className="recipient-box"><div className="momo-label">PEER POCKETS MOBILE MONEY</div><strong>050 012 6026</strong><span>Send your contribution to this number using your preferred network.</span></div><label>Network<select value={senderNetwork} onChange={e=>setSenderNetwork(e.target.value)}><option>MTN Mobile Money</option><option>Telecel Cash</option><option>AT Money</option></select></label><button className="support-btn" onClick={beginPayment}>Continue to payment →</button>{paymentState!=="idle"&&<div className="momo-box"><div className="momo-label">PAYMENT STATUS</div><div className="momo-number">GHS {Number(amount||0).toLocaleString()}</div><div className="momo-network">{senderNetwork} · {phone}</div><p>{notice}</p>{paymentState==="waiting"&&<><div className="confirmation-box"><b>Reference confirmation</b><p>For the current prototype, enter the transaction/reference number after completing the transfer. When the real Request-to-Pay integration is enabled, this manual step will be replaced by automatic verification.</p><input value={paymentReference} onChange={e=>setPaymentReference(e.target.value)} placeholder="Transaction / reference number"/><button className="support-btn" onClick={confirmPayment}>Confirm payment →</button></div></>}{paymentState==="success"&&<div className="success-note">✓ Confirmation received. The admin/payment system can verify and credit the campaign.</div>}</div>}</div></div>}
  </main>;
}

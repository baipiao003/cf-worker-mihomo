var In=Object.defineProperty;var As=(s,e)=>{for(var t in e)In(s,t,{get:e[t],enumerable:!0})};var bs={};As(bs,{Alias:()=>te,CST:()=>ms,Composer:()=>we,Document:()=>ne,Lexer:()=>De,LineCounter:()=>Be,Pair:()=>C,Parser:()=>Se,Scalar:()=>y,Schema:()=>Te,YAMLError:()=>Me,YAMLMap:()=>T,YAMLParseError:()=>q,YAMLSeq:()=>P,YAMLWarning:()=>$e,isAlias:()=>R,isCollection:()=>_,isDocument:()=>F,isMap:()=>U,isNode:()=>O,isPair:()=>E,isScalar:()=>v,isSeq:()=>G,parse:()=>bn,parseAllDocuments:()=>yn,parseDocument:()=>ys,stringify:()=>wn,visit:()=>H,visitAsync:()=>Re});var nt=Symbol.for("yaml.alias"),it=Symbol.for("yaml.document"),Y=Symbol.for("yaml.map"),Vt=Symbol.for("yaml.pair"),j=Symbol.for("yaml.scalar"),re=Symbol.for("yaml.seq"),B=Symbol.for("yaml.node.type"),R=s=>!!s&&typeof s=="object"&&s[B]===nt,F=s=>!!s&&typeof s=="object"&&s[B]===it,U=s=>!!s&&typeof s=="object"&&s[B]===Y,E=s=>!!s&&typeof s=="object"&&s[B]===Vt,v=s=>!!s&&typeof s=="object"&&s[B]===j,G=s=>!!s&&typeof s=="object"&&s[B]===re;function _(s){if(s&&typeof s=="object")switch(s[B]){case Y:case re:return!0}return!1}function O(s){if(s&&typeof s=="object")switch(s[B]){case nt:case Y:case j:case re:return!0}return!1}var ot=s=>(v(s)||_(s))&&!!s.anchor;var K=Symbol("break visit"),xs=Symbol("skip children"),Z=Symbol("remove node");function H(s,e){let t=Ns(e);F(s)?Ae(null,s.contents,t,Object.freeze([s]))===Z&&(s.contents=null):Ae(null,s,t,Object.freeze([]))}H.BREAK=K;H.SKIP=xs;H.REMOVE=Z;function Ae(s,e,t,n){let i=vs(s,e,t,n);if(O(i)||E(i))return Es(s,n,i),Ae(s,i,t,n);if(typeof i!="symbol"){if(_(e)){n=Object.freeze(n.concat(e));for(let o=0;o<e.items.length;++o){let r=Ae(o,e.items[o],t,n);if(typeof r=="number")o=r-1;else{if(r===K)return K;r===Z&&(e.items.splice(o,1),o-=1)}}}else if(E(e)){n=Object.freeze(n.concat(e));let o=Ae("key",e.key,t,n);if(o===K)return K;o===Z&&(e.key=null);let r=Ae("value",e.value,t,n);if(r===K)return K;r===Z&&(e.value=null)}}return i}async function Re(s,e){let t=Ns(e);F(s)?await xe(null,s.contents,t,Object.freeze([s]))===Z&&(s.contents=null):await xe(null,s,t,Object.freeze([]))}Re.BREAK=K;Re.SKIP=xs;Re.REMOVE=Z;async function xe(s,e,t,n){let i=await vs(s,e,t,n);if(O(i)||E(i))return Es(s,n,i),xe(s,i,t,n);if(typeof i!="symbol"){if(_(e)){n=Object.freeze(n.concat(e));for(let o=0;o<e.items.length;++o){let r=await xe(o,e.items[o],t,n);if(typeof r=="number")o=r-1;else{if(r===K)return K;r===Z&&(e.items.splice(o,1),o-=1)}}}else if(E(e)){n=Object.freeze(n.concat(e));let o=await xe("key",e.key,t,n);if(o===K)return K;o===Z&&(e.key=null);let r=await xe("value",e.value,t,n);if(r===K)return K;r===Z&&(e.value=null)}}return i}function Ns(s){return typeof s=="object"&&(s.Collection||s.Node||s.Value)?Object.assign({Alias:s.Node,Map:s.Node,Scalar:s.Node,Seq:s.Node},s.Value&&{Map:s.Value,Scalar:s.Value,Seq:s.Value},s.Collection&&{Map:s.Collection,Seq:s.Collection},s):s}function vs(s,e,t,n){if(typeof t=="function")return t(s,e,n);if(U(e))return t.Map?.(s,e,n);if(G(e))return t.Seq?.(s,e,n);if(E(e))return t.Pair?.(s,e,n);if(v(e))return t.Scalar?.(s,e,n);if(R(e))return t.Alias?.(s,e,n)}function Es(s,e,t){let n=e[e.length-1];if(_(n))n.items[s]=t;else if(E(n))s==="key"?n.key=t:n.value=t;else if(F(n))n.contents=t;else{let i=R(n)?"alias":"scalar";throw new Error(`Cannot replace node with ${i} parent`)}}var Mn={"!":"%21",",":"%2C","[":"%5B","]":"%5D","{":"%7B","}":"%7D"},$n=s=>s.replace(/[!,[\]{}]/g,e=>Mn[e]),ee=class s{constructor(e,t){this.docStart=null,this.docEnd=!1,this.yaml=Object.assign({},s.defaultYaml,e),this.tags=Object.assign({},s.defaultTags,t)}clone(){let e=new s(this.yaml,this.tags);return e.docStart=this.docStart,e}atDocument(){let e=new s(this.yaml,this.tags);switch(this.yaml.version){case"1.1":this.atNextDocument=!0;break;case"1.2":this.atNextDocument=!1,this.yaml={explicit:s.defaultYaml.explicit,version:"1.2"},this.tags=Object.assign({},s.defaultTags);break}return e}add(e,t){this.atNextDocument&&(this.yaml={explicit:s.defaultYaml.explicit,version:"1.1"},this.tags=Object.assign({},s.defaultTags),this.atNextDocument=!1);let n=e.trim().split(/[ \t]+/),i=n.shift();switch(i){case"%TAG":{if(n.length!==2&&(t(0,"%TAG directive should contain exactly two parts"),n.length<2))return!1;let[o,r]=n;return this.tags[o]=r,!0}case"%YAML":{if(this.yaml.explicit=!0,n.length!==1)return t(0,"%YAML directive should contain exactly one part"),!1;let[o]=n;if(o==="1.1"||o==="1.2")return this.yaml.version=o,!0;{let r=/^\d+\.\d+$/.test(o);return t(6,`Unsupported YAML version ${o}`,r),!1}}default:return t(0,`Unknown directive ${i}`,!0),!1}}tagName(e,t){if(e==="!")return"!";if(e[0]!=="!")return t(`Not a valid tag: ${e}`),null;if(e[1]==="<"){let r=e.slice(2,-1);return r==="!"||r==="!!"?(t(`Verbatim tags aren't resolved, so ${e} is invalid.`),null):(e[e.length-1]!==">"&&t("Verbatim tags must end with a >"),r)}let[,n,i]=e.match(/^(.*!)([^!]*)$/s);i||t(`The ${e} tag has no suffix`);let o=this.tags[n];if(o)try{return o+decodeURIComponent(i)}catch(r){return t(String(r)),null}return n==="!"?e:(t(`Could not resolve tag: ${e}`),null)}tagString(e){for(let[t,n]of Object.entries(this.tags))if(e.startsWith(n))return t+$n(e.substring(n.length));return e[0]==="!"?e:`!<${e}>`}toString(e){let t=this.yaml.explicit?[`%YAML ${this.yaml.version||"1.2"}`]:[],n=Object.entries(this.tags),i;if(e&&n.length>0&&O(e.contents)){let o={};H(e.contents,(r,a)=>{O(a)&&a.tag&&(o[a.tag]=!0)}),i=Object.keys(o)}else i=[];for(let[o,r]of n)o==="!!"&&r==="tag:yaml.org,2002:"||(!e||i.some(a=>a.startsWith(r)))&&t.push(`%TAG ${o} ${r}`);return t.join(`
`)}};ee.defaultYaml={explicit:!1,version:"1.2"};ee.defaultTags={"!!":"tag:yaml.org,2002:"};function rt(s){if(/[\x00-\x19\s,[\]{}]/.test(s)){let t=`Anchor must not contain whitespace or control characters: ${JSON.stringify(s)}`;throw new Error(t)}return!0}function Jt(s){let e=new Set;return H(s,{Value(t,n){n.anchor&&e.add(n.anchor)}}),e}function Yt(s,e){for(let t=1;;++t){let n=`${s}${t}`;if(!e.has(n))return n}}function Os(s,e){let t=[],n=new Map,i=null;return{onAnchor:o=>{t.push(o),i??(i=Jt(s));let r=Yt(e,i);return i.add(r),r},setAnchors:()=>{for(let o of t){let r=n.get(o);if(typeof r=="object"&&r.anchor&&(v(r.node)||_(r.node)))r.node.anchor=r.anchor;else{let a=new Error("Failed to resolve repeated object (this should not happen)");throw a.source=o,a}}},sourceObjects:n}}function ue(s,e,t,n){if(n&&typeof n=="object")if(Array.isArray(n))for(let i=0,o=n.length;i<o;++i){let r=n[i],a=ue(s,n,String(i),r);a===void 0?delete n[i]:a!==r&&(n[i]=a)}else if(n instanceof Map)for(let i of Array.from(n.keys())){let o=n.get(i),r=ue(s,n,i,o);r===void 0?n.delete(i):r!==o&&n.set(i,r)}else if(n instanceof Set)for(let i of Array.from(n)){let o=ue(s,n,i,i);o===void 0?n.delete(i):o!==i&&(n.delete(i),n.add(o))}else for(let[i,o]of Object.entries(n)){let r=ue(s,n,i,o);r===void 0?delete n[i]:r!==o&&(n[i]=r)}return s.call(e,t,n)}function $(s,e,t){if(Array.isArray(s))return s.map((n,i)=>$(n,String(i),t));if(s&&typeof s.toJSON=="function"){if(!t||!ot(s))return s.toJSON(e,t);let n={aliasCount:0,count:1,res:void 0};t.anchors.set(s,n),t.onCreate=o=>{n.res=o,delete t.onCreate};let i=s.toJSON(e,t);return t.onCreate&&t.onCreate(i),i}return typeof s=="bigint"&&!t?.keep?Number(s):s}var pe=class{constructor(e){Object.defineProperty(this,B,{value:e})}clone(){let e=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));return this.range&&(e.range=this.range.slice()),e}toJS(e,{mapAsMap:t,maxAliasCount:n,onAnchor:i,reviver:o}={}){if(!F(e))throw new TypeError("A document argument is required");let r={anchors:new Map,doc:e,keep:!0,mapAsMap:t===!0,mapKeyWarned:!1,maxAliasCount:typeof n=="number"?n:100},a=$(this,"",r);if(typeof i=="function")for(let{count:l,res:c}of r.anchors.values())i(c,l);return typeof o=="function"?ue(o,{"":a},"",a):a}};var te=class extends pe{constructor(e){super(nt),this.source=e,Object.defineProperty(this,"tag",{set(){throw new Error("Alias nodes cannot have tags")}})}resolve(e,t){let n;t?.aliasResolveCache?n=t.aliasResolveCache:(n=[],H(e,{Node:(o,r)=>{(R(r)||ot(r))&&n.push(r)}}),t&&(t.aliasResolveCache=n));let i;for(let o of n){if(o===this)break;o.anchor===this.source&&(i=o)}return i}toJSON(e,t){if(!t)return{source:this.source};let{anchors:n,doc:i,maxAliasCount:o}=t,r=this.resolve(i,t);if(!r){let l=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw new ReferenceError(l)}let a=n.get(r);if(a||($(r,null,t),a=n.get(r)),!a||a.res===void 0){let l="This should not happen: Alias anchor was not resolved?";throw new ReferenceError(l)}if(o>=0&&(a.count+=1,a.aliasCount===0&&(a.aliasCount=at(i,r,n)),a.count*a.aliasCount>o)){let l="Excessive alias count indicates a resource exhaustion attack";throw new ReferenceError(l)}return a.res}toString(e,t,n){let i=`*${this.source}`;if(e){if(rt(this.source),e.options.verifyAliasOrder&&!e.anchors.has(this.source)){let o=`Unresolved alias (the anchor must be set before the alias): ${this.source}`;throw new Error(o)}if(e.implicitKey)return`${i} `}return i}};function at(s,e,t){if(R(e)){let n=e.resolve(s),i=t&&n&&t.get(n);return i?i.count*i.aliasCount:0}else if(_(e)){let n=0;for(let i of e.items){let o=at(s,i,t);o>n&&(n=o)}return n}else if(E(e)){let n=at(s,e.key,t),i=at(s,e.value,t);return Math.max(n,i)}return 1}var lt=s=>!s||typeof s!="function"&&typeof s!="object",y=class extends pe{constructor(e){super(j),this.value=e}toJSON(e,t){return t?.keep?this.value:$(this.value,e,t)}toString(){return String(this.value)}};y.BLOCK_FOLDED="BLOCK_FOLDED";y.BLOCK_LITERAL="BLOCK_LITERAL";y.PLAIN="PLAIN";y.QUOTE_DOUBLE="QUOTE_DOUBLE";y.QUOTE_SINGLE="QUOTE_SINGLE";var Pn="tag:yaml.org,2002:";function Dn(s,e,t){if(e){let n=t.filter(o=>o.tag===e),i=n.find(o=>!o.format)??n[0];if(!i)throw new Error(`Tag ${e} not found`);return i}return t.find(n=>n.identify?.(s)&&!n.format)}function ae(s,e,t){if(F(s)&&(s=s.contents),O(s))return s;if(E(s)){let f=t.schema[Y].createNode?.(t.schema,null,t);return f.items.push(s),f}(s instanceof String||s instanceof Number||s instanceof Boolean||typeof BigInt<"u"&&s instanceof BigInt)&&(s=s.valueOf());let{aliasDuplicateObjects:n,onAnchor:i,onTagObj:o,schema:r,sourceObjects:a}=t,l;if(n&&s&&typeof s=="object"){if(l=a.get(s),l)return l.anchor??(l.anchor=i(s)),new te(l.anchor);l={anchor:null,node:null},a.set(s,l)}e?.startsWith("!!")&&(e=Pn+e.slice(2));let c=Dn(s,e,r.tags);if(!c){if(s&&typeof s.toJSON=="function"&&(s=s.toJSON()),!s||typeof s!="object"){let f=new y(s);return l&&(l.node=f),f}c=s instanceof Map?r[Y]:Symbol.iterator in Object(s)?r[re]:r[Y]}o&&(o(c),delete t.onTagObj);let d=c?.createNode?c.createNode(t.schema,s,t):typeof c?.nodeClass?.from=="function"?c.nodeClass.from(t.schema,s,t):new y(s);return e?d.tag=e:c.default||(d.tag=c.tag),l&&(l.node=d),d}function qe(s,e,t){let n=t;for(let i=e.length-1;i>=0;--i){let o=e[i];if(typeof o=="number"&&Number.isInteger(o)&&o>=0){let r=[];r[o]=n,n=r}else n=new Map([[o,n]])}return ae(n,void 0,{aliasDuplicateObjects:!1,keepUndefined:!1,onAnchor:()=>{throw new Error("This should not happen, please report a bug.")},schema:s,sourceObjects:new Map})}var ve=s=>s==null||typeof s=="object"&&!!s[Symbol.iterator]().next().done,Ne=class extends pe{constructor(e,t){super(e),Object.defineProperty(this,"schema",{value:t,configurable:!0,enumerable:!1,writable:!0})}clone(e){let t=Object.create(Object.getPrototypeOf(this),Object.getOwnPropertyDescriptors(this));return e&&(t.schema=e),t.items=t.items.map(n=>O(n)||E(n)?n.clone(e):n),this.range&&(t.range=this.range.slice()),t}addIn(e,t){if(ve(e))this.add(t);else{let[n,...i]=e,o=this.get(n,!0);if(_(o))o.addIn(i,t);else if(o===void 0&&this.schema)this.set(n,qe(this.schema,i,t));else throw new Error(`Expected YAML collection at ${n}. Remaining path: ${i}`)}}deleteIn(e){let[t,...n]=e;if(n.length===0)return this.delete(t);let i=this.get(t,!0);if(_(i))return i.deleteIn(n);throw new Error(`Expected YAML collection at ${t}. Remaining path: ${n}`)}getIn(e,t){let[n,...i]=e,o=this.get(n,!0);return i.length===0?!t&&v(o)?o.value:o:_(o)?o.getIn(i,t):void 0}hasAllNullValues(e){return this.items.every(t=>{if(!E(t))return!1;let n=t.value;return n==null||e&&v(n)&&n.value==null&&!n.commentBefore&&!n.comment&&!n.tag})}hasIn(e){let[t,...n]=e;if(n.length===0)return this.has(t);let i=this.get(t,!0);return _(i)?i.hasIn(n):!1}setIn(e,t){let[n,...i]=e;if(i.length===0)this.set(n,t);else{let o=this.get(n,!0);if(_(o))o.setIn(i,t);else if(o===void 0&&this.schema)this.set(n,qe(this.schema,i,t));else throw new Error(`Expected YAML collection at ${n}. Remaining path: ${i}`)}}};var _s=s=>s.replace(/^(?!$)(?: $)?/gm,"#");function V(s,e){return/^\n+$/.test(s)?s.substring(1):e?s.replace(/^(?! *$)/gm,e):s}var se=(s,e,t)=>s.endsWith(`
`)?V(t,e):t.includes(`
`)?`
`+V(t,e):(s.endsWith(" ")?"":" ")+t;var Ht="flow",ct="block",Fe="quoted";function Ue(s,e,t="flow",{indentAtStart:n,lineWidth:i=80,minContentWidth:o=20,onFold:r,onOverflow:a}={}){if(!i||i<0)return s;i<o&&(o=0);let l=Math.max(1+o,1+i-e.length);if(s.length<=l)return s;let c=[],d={},f=i-e.length;typeof n=="number"&&(n>i-Math.max(2,o)?c.push(0):f=i-n);let u,m,g=!1,p=-1,h=-1,w=-1;t===ct&&(p=Ls(s,p,e.length),p!==-1&&(f=p+l));for(let k;k=s[p+=1];){if(t===Fe&&k==="\\"){switch(h=p,s[p+1]){case"x":p+=3;break;case"u":p+=5;break;case"U":p+=9;break;default:p+=1}w=p}if(k===`
`)t===ct&&(p=Ls(s,p,e.length)),f=p+e.length+l,u=void 0;else{if(k===" "&&m&&m!==" "&&m!==`
`&&m!=="	"){let A=s[p+1];A&&A!==" "&&A!==`
`&&A!=="	"&&(u=p)}if(p>=f)if(u)c.push(u),f=u+l,u=void 0;else if(t===Fe){for(;m===" "||m==="	";)m=k,k=s[p+=1],g=!0;let A=p>w+1?p-2:h-1;if(d[A])return s;c.push(A),d[A]=!0,f=A+l,u=void 0}else g=!0}m=k}if(g&&a&&a(),c.length===0)return s;r&&r();let S=s.slice(0,c[0]);for(let k=0;k<c.length;++k){let A=c[k],x=c[k+1]||s.length;A===0?S=`
${e}${s.slice(0,x)}`:(t===Fe&&d[A]&&(S+=`${s[A]}\\`),S+=`
${e}${s.slice(A+1,x)}`)}return S}function Ls(s,e,t){let n=e,i=e+1,o=s[i];for(;o===" "||o==="	";)if(e<i+t)o=s[++e];else{do o=s[++e];while(o&&o!==`
`);n=e,i=e+1,o=s[i]}return n}var ut=(s,e)=>({indentAtStart:e?s.indent.length:s.indentAtStart,lineWidth:s.options.lineWidth,minContentWidth:s.options.minContentWidth}),pt=s=>/^(%|---|\.\.\.)/m.test(s);function Bn(s,e,t){if(!e||e<0)return!1;let n=e-t,i=s.length;if(i<=n)return!1;for(let o=0,r=0;o<i;++o)if(s[o]===`
`){if(o-r>n)return!0;if(r=o+1,i-r<=n)return!1}return!0}function Ge(s,e){let t=JSON.stringify(s);if(e.options.doubleQuotedAsJSON)return t;let{implicitKey:n}=e,i=e.options.doubleQuotedMinMultiLineLength,o=e.indent||(pt(s)?"  ":""),r="",a=0;for(let l=0,c=t[l];c;c=t[++l])if(c===" "&&t[l+1]==="\\"&&t[l+2]==="n"&&(r+=t.slice(a,l)+"\\ ",l+=1,a=l,c="\\"),c==="\\")switch(t[l+1]){case"u":{r+=t.slice(a,l);let d=t.substr(l+2,4);switch(d){case"0000":r+="\\0";break;case"0007":r+="\\a";break;case"000b":r+="\\v";break;case"001b":r+="\\e";break;case"0085":r+="\\N";break;case"00a0":r+="\\_";break;case"2028":r+="\\L";break;case"2029":r+="\\P";break;default:d.substr(0,2)==="00"?r+="\\x"+d.substr(2):r+=t.substr(l,6)}l+=5,a=l+1}break;case"n":if(n||t[l+2]==='"'||t.length<i)l+=1;else{for(r+=t.slice(a,l)+`

`;t[l+2]==="\\"&&t[l+3]==="n"&&t[l+4]!=='"';)r+=`
`,l+=2;r+=o,t[l+2]===" "&&(r+="\\"),l+=1,a=l+1}break;default:l+=1}return r=a?r+t.slice(a):t,n?r:Ue(r,o,Fe,ut(e,!1))}function Wt(s,e){if(e.options.singleQuote===!1||e.implicitKey&&s.includes(`
`)||/[ \t]\n|\n[ \t]/.test(s))return Ge(s,e);let t=e.indent||(pt(s)?"  ":""),n="'"+s.replace(/'/g,"''").replace(/\n+/g,`$&
${t}`)+"'";return e.implicitKey?n:Ue(n,t,Ht,ut(e,!1))}function Ee(s,e){let{singleQuote:t}=e.options,n;if(t===!1)n=Ge;else{let i=s.includes('"'),o=s.includes("'");i&&!o?n=Wt:o&&!i?n=Ge:n=t?Wt:Ge}return n(s,e)}var zt;try{zt=new RegExp(`(^|(?<!
))
+(?!
|$)`,"g")}catch{zt=/\n+(?!\n|$)/g}function ft({comment:s,type:e,value:t},n,i,o){let{blockQuote:r,commentString:a,lineWidth:l}=n.options;if(!r||/\n[\t ]+$/.test(t))return Ee(t,n);let c=n.indent||(n.forceBlockIndent||pt(t)?"  ":""),d=r==="literal"?!0:r==="folded"||e===y.BLOCK_FOLDED?!1:e===y.BLOCK_LITERAL?!0:!Bn(t,l,c.length);if(!t)return d?`|
`:`>
`;let f,u;for(u=t.length;u>0;--u){let x=t[u-1];if(x!==`
`&&x!=="	"&&x!==" ")break}let m=t.substring(u),g=m.indexOf(`
`);g===-1?f="-":t===m||g!==m.length-1?(f="+",o&&o()):f="",m&&(t=t.slice(0,-m.length),m[m.length-1]===`
`&&(m=m.slice(0,-1)),m=m.replace(zt,`$&${c}`));let p=!1,h,w=-1;for(h=0;h<t.length;++h){let x=t[h];if(x===" ")p=!0;else if(x===`
`)w=h;else break}let S=t.substring(0,w<h?w+1:h);S&&(t=t.substring(S.length),S=S.replace(/\n+/g,`$&${c}`));let A=(p?c?"2":"1":"")+f;if(s&&(A+=" "+a(s.replace(/ ?[\r\n]+/g," ")),i&&i()),!d){let x=t.replace(/\n+/g,`
$&`).replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g,"$1$2").replace(/\n+/g,`$&${c}`),N=!1,L=ut(n,!0);r!=="folded"&&e!==y.BLOCK_FOLDED&&(L.onOverflow=()=>{N=!0});let b=Ue(`${S}${x}${m}`,c,ct,L);if(!N)return`>${A}
${c}${b}`}return t=t.replace(/\n+/g,`$&${c}`),`|${A}
${c}${S}${t}${m}`}function Kn(s,e,t,n){let{type:i,value:o}=s,{actualString:r,implicitKey:a,indent:l,indentStep:c,inFlow:d}=e;if(a&&o.includes(`
`)||d&&/[[\]{},]/.test(o))return Ee(o,e);if(/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(o))return a||d||!o.includes(`
`)?Ee(o,e):ft(s,e,t,n);if(!a&&!d&&i!==y.PLAIN&&o.includes(`
`))return ft(s,e,t,n);if(pt(o)){if(l==="")return e.forceBlockIndent=!0,ft(s,e,t,n);if(a&&l===c)return Ee(o,e)}let f=o.replace(/\n+/g,`$&
${l}`);if(r){let u=p=>p.default&&p.tag!=="tag:yaml.org,2002:str"&&p.test?.test(f),{compat:m,tags:g}=e.doc.schema;if(g.some(u)||m?.some(u))return Ee(o,e)}return a?f:Ue(f,l,Ht,ut(e,!1))}function le(s,e,t,n){let{implicitKey:i,inFlow:o}=e,r=typeof s.value=="string"?s:Object.assign({},s,{value:String(s.value)}),{type:a}=s;a!==y.QUOTE_DOUBLE&&/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(r.value)&&(a=y.QUOTE_DOUBLE);let l=d=>{switch(d){case y.BLOCK_FOLDED:case y.BLOCK_LITERAL:return i||o?Ee(r.value,e):ft(r,e,t,n);case y.QUOTE_DOUBLE:return Ge(r.value,e);case y.QUOTE_SINGLE:return Wt(r.value,e);case y.PLAIN:return Kn(r,e,t,n);default:return null}},c=l(a);if(c===null){let{defaultKeyType:d,defaultStringType:f}=e.options,u=i&&d||f;if(c=l(u),c===null)throw new Error(`Unsupported default string type ${u}`)}return c}function dt(s,e){let t=Object.assign({blockQuote:!0,commentString:_s,defaultKeyType:null,defaultStringType:"PLAIN",directives:null,doubleQuotedAsJSON:!1,doubleQuotedMinMultiLineLength:40,falseStr:"false",flowCollectionPadding:!0,indentSeq:!0,lineWidth:80,minContentWidth:20,nullStr:"null",simpleKeys:!1,singleQuote:null,trueStr:"true",verifyAliasOrder:!0},s.schema.toStringOptions,e),n;switch(t.collectionStyle){case"block":n=!1;break;case"flow":n=!0;break;default:n=null}return{anchors:new Set,doc:s,flowCollectionPadding:t.flowCollectionPadding?" ":"",indent:"",indentStep:typeof t.indent=="number"?" ".repeat(t.indent):"  ",inFlow:n,options:t}}function jn(s,e){if(e.tag){let i=s.filter(o=>o.tag===e.tag);if(i.length>0)return i.find(o=>o.format===e.format)??i[0]}let t,n;if(v(e)){n=e.value;let i=s.filter(o=>o.identify?.(n));if(i.length>1){let o=i.filter(r=>r.test);o.length>0&&(i=o)}t=i.find(o=>o.format===e.format)??i.find(o=>!o.format)}else n=e,t=s.find(i=>i.nodeClass&&n instanceof i.nodeClass);if(!t){let i=n?.constructor?.name??(n===null?"null":typeof n);throw new Error(`Tag not resolved for ${i} value`)}return t}function Rn(s,e,{anchors:t,doc:n}){if(!n.directives)return"";let i=[],o=(v(s)||_(s))&&s.anchor;o&&rt(o)&&(t.add(o),i.push(`&${o}`));let r=s.tag??(e.default?null:e.tag);return r&&i.push(n.directives.tagString(r)),i.join(" ")}function ce(s,e,t,n){if(E(s))return s.toString(e,t,n);if(R(s)){if(e.doc.directives)return s.toString(e);if(e.resolvedAliases?.has(s))throw new TypeError("Cannot stringify circular structure without alias nodes");e.resolvedAliases?e.resolvedAliases.add(s):e.resolvedAliases=new Set([s]),s=s.resolve(e.doc)}let i,o=O(s)?s:e.doc.createNode(s,{onTagObj:l=>i=l});i??(i=jn(e.doc.schema.tags,o));let r=Rn(o,i,e);r.length>0&&(e.indentAtStart=(e.indentAtStart??0)+r.length+1);let a=typeof i.stringify=="function"?i.stringify(o,e,t,n):v(o)?le(o,e,t,n):o.toString(e,t,n);return r?v(o)||a[0]==="{"||a[0]==="["?`${r} ${a}`:`${r}
${e.indent}${a}`:a}function Cs({key:s,value:e},t,n,i){let{allNullValues:o,doc:r,indent:a,indentStep:l,options:{commentString:c,indentSeq:d,simpleKeys:f}}=t,u=O(s)&&s.comment||null;if(f){if(u)throw new Error("With simple keys, key nodes cannot have comments");if(_(s)||!O(s)&&typeof s=="object"){let L="With simple keys, collection cannot be used as a key value";throw new Error(L)}}let m=!f&&(!s||u&&e==null&&!t.inFlow||_(s)||(v(s)?s.type===y.BLOCK_FOLDED||s.type===y.BLOCK_LITERAL:typeof s=="object"));t=Object.assign({},t,{allNullValues:!1,implicitKey:!m&&(f||!o),indent:a+l});let g=!1,p=!1,h=ce(s,t,()=>g=!0,()=>p=!0);if(!m&&!t.inFlow&&h.length>1024){if(f)throw new Error("With simple keys, single line scalar must not span more than 1024 characters");m=!0}if(t.inFlow){if(o||e==null)return g&&n&&n(),h===""?"?":m?`? ${h}`:h}else if(o&&!f||e==null&&m)return h=`? ${h}`,u&&!g?h+=se(h,t.indent,c(u)):p&&i&&i(),h;g&&(u=null),m?(u&&(h+=se(h,t.indent,c(u))),h=`? ${h}
${a}:`):(h=`${h}:`,u&&(h+=se(h,t.indent,c(u))));let w,S,k;O(e)?(w=!!e.spaceBefore,S=e.commentBefore,k=e.comment):(w=!1,S=null,k=null,e&&typeof e=="object"&&(e=r.createNode(e))),t.implicitKey=!1,!m&&!u&&v(e)&&(t.indentAtStart=h.length+1),p=!1,!d&&l.length>=2&&!t.inFlow&&!m&&G(e)&&!e.flow&&!e.tag&&!e.anchor&&(t.indent=t.indent.substring(2));let A=!1,x=ce(e,t,()=>A=!0,()=>p=!0),N=" ";if(u||w||S){if(N=w?`
`:"",S){let L=c(S);N+=`
${V(L,t.indent)}`}x===""&&!t.inFlow?N===`
`&&(N=`

`):N+=`
${t.indent}`}else if(!m&&_(e)){let L=x[0],b=x.indexOf(`
`),I=b!==-1,fe=t.inFlow??e.flow??e.items.length===0;if(I||!fe){let ke=!1;if(I&&(L==="&"||L==="!")){let M=x.indexOf(" ");L==="&"&&M!==-1&&M<b&&x[M+1]==="!"&&(M=x.indexOf(" ",M+1)),(M===-1||b<M)&&(ke=!0)}ke||(N=`
${t.indent}`)}}else(x===""||x[0]===`
`)&&(N="");return h+=N+x,t.inFlow?A&&n&&n():k&&!A?h+=se(h,t.indent,c(k)):p&&i&&i(),h}function ht(s,e){(s==="debug"||s==="warn")&&console.warn(e)}var mt="<<",W={identify:s=>s===mt||typeof s=="symbol"&&s.description===mt,default:"key",tag:"tag:yaml.org,2002:merge",test:/^<<$/,resolve:()=>Object.assign(new y(Symbol(mt)),{addToJSMap:Xt}),stringify:()=>mt},Ts=(s,e)=>(W.identify(e)||v(e)&&(!e.type||e.type===y.PLAIN)&&W.identify(e.value))&&s?.doc.schema.tags.some(t=>t.tag===W.tag&&t.default);function Xt(s,e,t){if(t=s&&R(t)?t.resolve(s.doc):t,G(t))for(let n of t.items)Qt(s,e,n);else if(Array.isArray(t))for(let n of t)Qt(s,e,n);else Qt(s,e,t)}function Qt(s,e,t){let n=s&&R(t)?t.resolve(s.doc):t;if(!U(n))throw new Error("Merge sources must be maps or map aliases");let i=n.toJSON(null,s,Map);for(let[o,r]of i)e instanceof Map?e.has(o)||e.set(o,r):e instanceof Set?e.add(o):Object.prototype.hasOwnProperty.call(e,o)||Object.defineProperty(e,o,{value:r,writable:!0,enumerable:!0,configurable:!0});return e}function gt(s,e,{key:t,value:n}){if(O(t)&&t.addToJSMap)t.addToJSMap(s,e,n);else if(Ts(s,t))Xt(s,e,n);else{let i=$(t,"",s);if(e instanceof Map)e.set(i,$(n,i,s));else if(e instanceof Set)e.add(i);else{let o=qn(t,i,s),r=$(n,o,s);o in e?Object.defineProperty(e,o,{value:r,writable:!0,enumerable:!0,configurable:!0}):e[o]=r}}return e}function qn(s,e,t){if(e===null)return"";if(typeof e!="object")return String(e);if(O(s)&&t?.doc){let n=dt(t.doc,{});n.anchors=new Set;for(let o of t.anchors.keys())n.anchors.add(o.anchor);n.inFlow=!0,n.inStringifyKey=!0;let i=s.toString(n);if(!t.mapKeyWarned){let o=JSON.stringify(i);o.length>40&&(o=o.substring(0,36)+'..."'),ht(t.doc.options.logLevel,`Keys with collection values will be stringified due to JS Object restrictions: ${o}. Set mapAsMap: true to use object keys.`),t.mapKeyWarned=!0}return i}return JSON.stringify(e)}function Oe(s,e,t){let n=ae(s,void 0,t),i=ae(e,void 0,t);return new C(n,i)}var C=class s{constructor(e,t=null){Object.defineProperty(this,B,{value:Vt}),this.key=e,this.value=t}clone(e){let{key:t,value:n}=this;return O(t)&&(t=t.clone(e)),O(n)&&(n=n.clone(e)),new s(t,n)}toJSON(e,t){let n=t?.mapAsMap?new Map:{};return gt(t,n,this)}toString(e,t,n){return e?.doc?Cs(this,e,t,n):JSON.stringify(this)}};function bt(s,e,t){return(e.inFlow??s.flow?Un:Fn)(s,e,t)}function Fn({comment:s,items:e},t,{blockItemPrefix:n,flowChars:i,itemIndent:o,onChompKeep:r,onComment:a}){let{indent:l,options:{commentString:c}}=t,d=Object.assign({},t,{indent:o,type:null}),f=!1,u=[];for(let g=0;g<e.length;++g){let p=e[g],h=null;if(O(p))!f&&p.spaceBefore&&u.push(""),yt(t,u,p.commentBefore,f),p.comment&&(h=p.comment);else if(E(p)){let S=O(p.key)?p.key:null;S&&(!f&&S.spaceBefore&&u.push(""),yt(t,u,S.commentBefore,f))}f=!1;let w=ce(p,d,()=>h=null,()=>f=!0);h&&(w+=se(w,o,c(h))),f&&h&&(f=!1),u.push(n+w)}let m;if(u.length===0)m=i.start+i.end;else{m=u[0];for(let g=1;g<u.length;++g){let p=u[g];m+=p?`
${l}${p}`:`
`}}return s?(m+=`
`+V(c(s),l),a&&a()):f&&r&&r(),m}function Un({items:s},e,{flowChars:t,itemIndent:n}){let{indent:i,indentStep:o,flowCollectionPadding:r,options:{commentString:a}}=e;n+=o;let l=Object.assign({},e,{indent:n,inFlow:!0,type:null}),c=!1,d=0,f=[];for(let g=0;g<s.length;++g){let p=s[g],h=null;if(O(p))p.spaceBefore&&f.push(""),yt(e,f,p.commentBefore,!1),p.comment&&(h=p.comment);else if(E(p)){let S=O(p.key)?p.key:null;S&&(S.spaceBefore&&f.push(""),yt(e,f,S.commentBefore,!1),S.comment&&(c=!0));let k=O(p.value)?p.value:null;k?(k.comment&&(h=k.comment),k.commentBefore&&(c=!0)):p.value==null&&S?.comment&&(h=S.comment)}h&&(c=!0);let w=ce(p,l,()=>h=null);g<s.length-1&&(w+=","),h&&(w+=se(w,n,a(h))),!c&&(f.length>d||w.includes(`
`))&&(c=!0),f.push(w),d=f.length}let{start:u,end:m}=t;if(f.length===0)return u+m;if(!c){let g=f.reduce((p,h)=>p+h.length+2,2);c=e.options.lineWidth>0&&g>e.options.lineWidth}if(c){let g=u;for(let p of f)g+=p?`
${o}${i}${p}`:`
`;return`${g}
${i}${m}`}else return`${u}${r}${f.join(" ")}${r}${m}`}function yt({indent:s,options:{commentString:e}},t,n,i){if(n&&i&&(n=n.replace(/^\n+/,"")),n){let o=V(e(n),s);t.push(o.trimStart())}}function de(s,e){let t=v(e)?e.value:e;for(let n of s)if(E(n)&&(n.key===e||n.key===t||v(n.key)&&n.key.value===t))return n}var T=class extends Ne{static get tagName(){return"tag:yaml.org,2002:map"}constructor(e){super(Y,e),this.items=[]}static from(e,t,n){let{keepUndefined:i,replacer:o}=n,r=new this(e),a=(l,c)=>{if(typeof o=="function")c=o.call(t,l,c);else if(Array.isArray(o)&&!o.includes(l))return;(c!==void 0||i)&&r.items.push(Oe(l,c,n))};if(t instanceof Map)for(let[l,c]of t)a(l,c);else if(t&&typeof t=="object")for(let l of Object.keys(t))a(l,t[l]);return typeof e.sortMapEntries=="function"&&r.items.sort(e.sortMapEntries),r}add(e,t){let n;E(e)?n=e:!e||typeof e!="object"||!("key"in e)?n=new C(e,e?.value):n=new C(e.key,e.value);let i=de(this.items,n.key),o=this.schema?.sortMapEntries;if(i){if(!t)throw new Error(`Key ${n.key} already set`);v(i.value)&&lt(n.value)?i.value.value=n.value:i.value=n.value}else if(o){let r=this.items.findIndex(a=>o(n,a)<0);r===-1?this.items.push(n):this.items.splice(r,0,n)}else this.items.push(n)}delete(e){let t=de(this.items,e);return t?this.items.splice(this.items.indexOf(t),1).length>0:!1}get(e,t){let i=de(this.items,e)?.value;return(!t&&v(i)?i.value:i)??void 0}has(e){return!!de(this.items,e)}set(e,t){this.add(new C(e,t),!0)}toJSON(e,t,n){let i=n?new n:t?.mapAsMap?new Map:{};t?.onCreate&&t.onCreate(i);for(let o of this.items)gt(t,i,o);return i}toString(e,t,n){if(!e)return JSON.stringify(this);for(let i of this.items)if(!E(i))throw new Error(`Map items must all be pairs; found ${JSON.stringify(i)} instead`);return!e.allNullValues&&this.hasAllNullValues(!1)&&(e=Object.assign({},e,{allNullValues:!0})),bt(this,e,{blockItemPrefix:"",flowChars:{start:"{",end:"}"},itemIndent:e.indent||"",onChompKeep:n,onComment:t})}};var z={collection:"map",default:!0,nodeClass:T,tag:"tag:yaml.org,2002:map",resolve(s,e){return U(s)||e("Expected a mapping for this tag"),s},createNode:(s,e,t)=>T.from(s,e,t)};var P=class extends Ne{static get tagName(){return"tag:yaml.org,2002:seq"}constructor(e){super(re,e),this.items=[]}add(e){this.items.push(e)}delete(e){let t=wt(e);return typeof t!="number"?!1:this.items.splice(t,1).length>0}get(e,t){let n=wt(e);if(typeof n!="number")return;let i=this.items[n];return!t&&v(i)?i.value:i}has(e){let t=wt(e);return typeof t=="number"&&t<this.items.length}set(e,t){let n=wt(e);if(typeof n!="number")throw new Error(`Expected a valid index, not ${e}.`);let i=this.items[n];v(i)&&lt(t)?i.value=t:this.items[n]=t}toJSON(e,t){let n=[];t?.onCreate&&t.onCreate(n);let i=0;for(let o of this.items)n.push($(o,String(i++),t));return n}toString(e,t,n){return e?bt(this,e,{blockItemPrefix:"- ",flowChars:{start:"[",end:"]"},itemIndent:(e.indent||"")+"  ",onChompKeep:n,onComment:t}):JSON.stringify(this)}static from(e,t,n){let{replacer:i}=n,o=new this(e);if(t&&Symbol.iterator in Object(t)){let r=0;for(let a of t){if(typeof i=="function"){let l=t instanceof Set?a:String(r++);a=i.call(t,l,a)}o.items.push(ae(a,void 0,n))}}return o}};function wt(s){let e=v(s)?s.value:s;return e&&typeof e=="string"&&(e=Number(e)),typeof e=="number"&&Number.isInteger(e)&&e>=0?e:null}var Q={collection:"seq",default:!0,nodeClass:P,tag:"tag:yaml.org,2002:seq",resolve(s,e){return G(s)||e("Expected a sequence for this tag"),s},createNode:(s,e,t)=>P.from(s,e,t)};var he={identify:s=>typeof s=="string",default:!0,tag:"tag:yaml.org,2002:str",resolve:s=>s,stringify(s,e,t,n){return e=Object.assign({actualString:!0},e),le(s,e,t,n)}};var be={identify:s=>s==null,createNode:()=>new y(null),default:!0,tag:"tag:yaml.org,2002:null",test:/^(?:~|[Nn]ull|NULL)?$/,resolve:()=>new y(null),stringify:({source:s},e)=>typeof s=="string"&&be.test.test(s)?s:e.options.nullStr};var Ve={identify:s=>typeof s=="boolean",default:!0,tag:"tag:yaml.org,2002:bool",test:/^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,resolve:s=>new y(s[0]==="t"||s[0]==="T"),stringify({source:s,value:e},t){if(s&&Ve.test.test(s)){let n=s[0]==="t"||s[0]==="T";if(e===n)return s}return e?t.options.trueStr:t.options.falseStr}};function D({format:s,minFractionDigits:e,tag:t,value:n}){if(typeof n=="bigint")return String(n);let i=typeof n=="number"?n:Number(n);if(!isFinite(i))return isNaN(i)?".nan":i<0?"-.inf":".inf";let o=JSON.stringify(n);if(!s&&e&&(!t||t==="tag:yaml.org,2002:float")&&/^\d/.test(o)){let r=o.indexOf(".");r<0&&(r=o.length,o+=".");let a=e-(o.length-r-1);for(;a-- >0;)o+="0"}return o}var St={identify:s=>typeof s=="number",default:!0,tag:"tag:yaml.org,2002:float",test:/^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,resolve:s=>s.slice(-3).toLowerCase()==="nan"?NaN:s[0]==="-"?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,stringify:D},kt={identify:s=>typeof s=="number",default:!0,tag:"tag:yaml.org,2002:float",format:"EXP",test:/^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,resolve:s=>parseFloat(s),stringify(s){let e=Number(s.value);return isFinite(e)?e.toExponential():D(s)}},At={identify:s=>typeof s=="number",default:!0,tag:"tag:yaml.org,2002:float",test:/^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,resolve(s){let e=new y(parseFloat(s)),t=s.indexOf(".");return t!==-1&&s[s.length-1]==="0"&&(e.minFractionDigits=s.length-t-1),e},stringify:D};var xt=s=>typeof s=="bigint"||Number.isInteger(s),Zt=(s,e,t,{intAsBigInt:n})=>n?BigInt(s):parseInt(s.substring(e),t);function Is(s,e,t){let{value:n}=s;return xt(n)&&n>=0?t+n.toString(e):D(s)}var Nt={identify:s=>xt(s)&&s>=0,default:!0,tag:"tag:yaml.org,2002:int",format:"OCT",test:/^0o[0-7]+$/,resolve:(s,e,t)=>Zt(s,2,8,t),stringify:s=>Is(s,8,"0o")},vt={identify:xt,default:!0,tag:"tag:yaml.org,2002:int",test:/^[-+]?[0-9]+$/,resolve:(s,e,t)=>Zt(s,0,10,t),stringify:D},Et={identify:s=>xt(s)&&s>=0,default:!0,tag:"tag:yaml.org,2002:int",format:"HEX",test:/^0x[0-9a-fA-F]+$/,resolve:(s,e,t)=>Zt(s,2,16,t),stringify:s=>Is(s,16,"0x")};var Ms=[z,Q,he,be,Ve,Nt,vt,Et,St,kt,At];function $s(s){return typeof s=="bigint"||Number.isInteger(s)}var Ot=({value:s})=>JSON.stringify(s),Gn=[{identify:s=>typeof s=="string",default:!0,tag:"tag:yaml.org,2002:str",resolve:s=>s,stringify:Ot},{identify:s=>s==null,createNode:()=>new y(null),default:!0,tag:"tag:yaml.org,2002:null",test:/^null$/,resolve:()=>null,stringify:Ot},{identify:s=>typeof s=="boolean",default:!0,tag:"tag:yaml.org,2002:bool",test:/^true$|^false$/,resolve:s=>s==="true",stringify:Ot},{identify:$s,default:!0,tag:"tag:yaml.org,2002:int",test:/^-?(?:0|[1-9][0-9]*)$/,resolve:(s,e,{intAsBigInt:t})=>t?BigInt(s):parseInt(s,10),stringify:({value:s})=>$s(s)?s.toString():JSON.stringify(s)},{identify:s=>typeof s=="number",default:!0,tag:"tag:yaml.org,2002:float",test:/^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,resolve:s=>parseFloat(s),stringify:Ot}],Vn={default:!0,tag:"",test:/^/,resolve(s,e){return e(`Unresolved plain scalar ${JSON.stringify(s)}`),s}},Ps=[z,Q].concat(Gn,Vn);var Je={identify:s=>s instanceof Uint8Array,default:!1,tag:"tag:yaml.org,2002:binary",resolve(s,e){if(typeof atob=="function"){let t=atob(s.replace(/[\n\r]/g,"")),n=new Uint8Array(t.length);for(let i=0;i<t.length;++i)n[i]=t.charCodeAt(i);return n}else return e("This environment does not support reading binary tags; either Buffer or atob is required"),s},stringify({comment:s,type:e,value:t},n,i,o){if(!t)return"";let r=t,a;if(typeof btoa=="function"){let l="";for(let c=0;c<r.length;++c)l+=String.fromCharCode(r[c]);a=btoa(l)}else throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");if(e??(e=y.BLOCK_LITERAL),e!==y.QUOTE_DOUBLE){let l=Math.max(n.options.lineWidth-n.indent.length,n.options.minContentWidth),c=Math.ceil(a.length/l),d=new Array(c);for(let f=0,u=0;f<c;++f,u+=l)d[f]=a.substr(u,l);a=d.join(e===y.BLOCK_LITERAL?`
`:" ")}return le({comment:s,type:e,value:a},n,i,o)}};function es(s,e){if(G(s))for(let t=0;t<s.items.length;++t){let n=s.items[t];if(!E(n)){if(U(n)){n.items.length>1&&e("Each pair must have its own sequence indicator");let i=n.items[0]||new C(new y(null));if(n.commentBefore&&(i.key.commentBefore=i.key.commentBefore?`${n.commentBefore}
${i.key.commentBefore}`:n.commentBefore),n.comment){let o=i.value??i.key;o.comment=o.comment?`${n.comment}
${o.comment}`:n.comment}n=i}s.items[t]=E(n)?n:new C(n)}}else e("Expected a sequence for this tag");return s}function ts(s,e,t){let{replacer:n}=t,i=new P(s);i.tag="tag:yaml.org,2002:pairs";let o=0;if(e&&Symbol.iterator in Object(e))for(let r of e){typeof n=="function"&&(r=n.call(e,String(o++),r));let a,l;if(Array.isArray(r))if(r.length===2)a=r[0],l=r[1];else throw new TypeError(`Expected [key, value] tuple: ${r}`);else if(r&&r instanceof Object){let c=Object.keys(r);if(c.length===1)a=c[0],l=r[a];else throw new TypeError(`Expected tuple with one key, not ${c.length} keys`)}else a=r;i.items.push(Oe(a,l,t))}return i}var Ye={collection:"seq",default:!1,tag:"tag:yaml.org,2002:pairs",resolve:es,createNode:ts};var _e=class s extends P{constructor(){super(),this.add=T.prototype.add.bind(this),this.delete=T.prototype.delete.bind(this),this.get=T.prototype.get.bind(this),this.has=T.prototype.has.bind(this),this.set=T.prototype.set.bind(this),this.tag=s.tag}toJSON(e,t){if(!t)return super.toJSON(e);let n=new Map;t?.onCreate&&t.onCreate(n);for(let i of this.items){let o,r;if(E(i)?(o=$(i.key,"",t),r=$(i.value,o,t)):o=$(i,"",t),n.has(o))throw new Error("Ordered maps must not include duplicate keys");n.set(o,r)}return n}static from(e,t,n){let i=ts(e,t,n),o=new this;return o.items=i.items,o}};_e.tag="tag:yaml.org,2002:omap";var He={collection:"seq",identify:s=>s instanceof Map,nodeClass:_e,default:!1,tag:"tag:yaml.org,2002:omap",resolve(s,e){let t=es(s,e),n=[];for(let{key:i}of t.items)v(i)&&(n.includes(i.value)?e(`Ordered maps must not include duplicate keys: ${i.value}`):n.push(i.value));return Object.assign(new _e,t)},createNode:(s,e,t)=>_e.from(s,e,t)};function Ds({value:s,source:e},t){return e&&(s?ss:ns).test.test(e)?e:s?t.options.trueStr:t.options.falseStr}var ss={identify:s=>s===!0,default:!0,tag:"tag:yaml.org,2002:bool",test:/^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,resolve:()=>new y(!0),stringify:Ds},ns={identify:s=>s===!1,default:!0,tag:"tag:yaml.org,2002:bool",test:/^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,resolve:()=>new y(!1),stringify:Ds};var Bs={identify:s=>typeof s=="number",default:!0,tag:"tag:yaml.org,2002:float",test:/^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,resolve:s=>s.slice(-3).toLowerCase()==="nan"?NaN:s[0]==="-"?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY,stringify:D},Ks={identify:s=>typeof s=="number",default:!0,tag:"tag:yaml.org,2002:float",format:"EXP",test:/^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,resolve:s=>parseFloat(s.replace(/_/g,"")),stringify(s){let e=Number(s.value);return isFinite(e)?e.toExponential():D(s)}},js={identify:s=>typeof s=="number",default:!0,tag:"tag:yaml.org,2002:float",test:/^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,resolve(s){let e=new y(parseFloat(s.replace(/_/g,""))),t=s.indexOf(".");if(t!==-1){let n=s.substring(t+1).replace(/_/g,"");n[n.length-1]==="0"&&(e.minFractionDigits=n.length)}return e},stringify:D};var We=s=>typeof s=="bigint"||Number.isInteger(s);function _t(s,e,t,{intAsBigInt:n}){let i=s[0];if((i==="-"||i==="+")&&(e+=1),s=s.substring(e).replace(/_/g,""),n){switch(t){case 2:s=`0b${s}`;break;case 8:s=`0o${s}`;break;case 16:s=`0x${s}`;break}let r=BigInt(s);return i==="-"?BigInt(-1)*r:r}let o=parseInt(s,t);return i==="-"?-1*o:o}function is(s,e,t){let{value:n}=s;if(We(n)){let i=n.toString(e);return n<0?"-"+t+i.substr(1):t+i}return D(s)}var Rs={identify:We,default:!0,tag:"tag:yaml.org,2002:int",format:"BIN",test:/^[-+]?0b[0-1_]+$/,resolve:(s,e,t)=>_t(s,2,2,t),stringify:s=>is(s,2,"0b")},qs={identify:We,default:!0,tag:"tag:yaml.org,2002:int",format:"OCT",test:/^[-+]?0[0-7_]+$/,resolve:(s,e,t)=>_t(s,1,8,t),stringify:s=>is(s,8,"0")},Fs={identify:We,default:!0,tag:"tag:yaml.org,2002:int",test:/^[-+]?[0-9][0-9_]*$/,resolve:(s,e,t)=>_t(s,0,10,t),stringify:D},Us={identify:We,default:!0,tag:"tag:yaml.org,2002:int",format:"HEX",test:/^[-+]?0x[0-9a-fA-F_]+$/,resolve:(s,e,t)=>_t(s,2,16,t),stringify:s=>is(s,16,"0x")};var Le=class s extends T{constructor(e){super(e),this.tag=s.tag}add(e){let t;E(e)?t=e:e&&typeof e=="object"&&"key"in e&&"value"in e&&e.value===null?t=new C(e.key,null):t=new C(e,null),de(this.items,t.key)||this.items.push(t)}get(e,t){let n=de(this.items,e);return!t&&E(n)?v(n.key)?n.key.value:n.key:n}set(e,t){if(typeof t!="boolean")throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof t}`);let n=de(this.items,e);n&&!t?this.items.splice(this.items.indexOf(n),1):!n&&t&&this.items.push(new C(e))}toJSON(e,t){return super.toJSON(e,t,Set)}toString(e,t,n){if(!e)return JSON.stringify(this);if(this.hasAllNullValues(!0))return super.toString(Object.assign({},e,{allNullValues:!0}),t,n);throw new Error("Set items must all have null values")}static from(e,t,n){let{replacer:i}=n,o=new this(e);if(t&&Symbol.iterator in Object(t))for(let r of t)typeof i=="function"&&(r=i.call(t,r,r)),o.items.push(Oe(r,null,n));return o}};Le.tag="tag:yaml.org,2002:set";var ze={collection:"map",identify:s=>s instanceof Set,nodeClass:Le,default:!1,tag:"tag:yaml.org,2002:set",createNode:(s,e,t)=>Le.from(s,e,t),resolve(s,e){if(U(s)){if(s.hasAllNullValues(!0))return Object.assign(new Le,s);e("Set items must all have null values")}else e("Expected a mapping for this tag");return s}};function os(s,e){let t=s[0],n=t==="-"||t==="+"?s.substring(1):s,i=r=>e?BigInt(r):Number(r),o=n.replace(/_/g,"").split(":").reduce((r,a)=>r*i(60)+i(a),i(0));return t==="-"?i(-1)*o:o}function Gs(s){let{value:e}=s,t=r=>r;if(typeof e=="bigint")t=r=>BigInt(r);else if(isNaN(e)||!isFinite(e))return D(s);let n="";e<0&&(n="-",e*=t(-1));let i=t(60),o=[e%i];return e<60?o.unshift(0):(e=(e-o[0])/i,o.unshift(e%i),e>=60&&(e=(e-o[0])/i,o.unshift(e))),n+o.map(r=>String(r).padStart(2,"0")).join(":").replace(/000000\d*$/,"")}var Lt={identify:s=>typeof s=="bigint"||Number.isInteger(s),default:!0,tag:"tag:yaml.org,2002:int",format:"TIME",test:/^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,resolve:(s,e,{intAsBigInt:t})=>os(s,t),stringify:Gs},Ct={identify:s=>typeof s=="number",default:!0,tag:"tag:yaml.org,2002:float",format:"TIME",test:/^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,resolve:s=>os(s,!1),stringify:Gs},Ce={identify:s=>s instanceof Date,default:!0,tag:"tag:yaml.org,2002:timestamp",test:RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),resolve(s){let e=s.match(Ce.test);if(!e)throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");let[,t,n,i,o,r,a]=e.map(Number),l=e[7]?Number((e[7]+"00").substr(1,3)):0,c=Date.UTC(t,n-1,i,o||0,r||0,a||0,l),d=e[8];if(d&&d!=="Z"){let f=os(d,!1);Math.abs(f)<30&&(f*=60),c-=6e4*f}return new Date(c)},stringify:({value:s})=>s?.toISOString().replace(/(T00:00:00)?\.000Z$/,"")??""};var rs=[z,Q,he,be,ss,ns,Rs,qs,Fs,Us,Bs,Ks,js,Je,W,He,Ye,ze,Lt,Ct,Ce];var Vs=new Map([["core",Ms],["failsafe",[z,Q,he]],["json",Ps],["yaml11",rs],["yaml-1.1",rs]]),Js={binary:Je,bool:Ve,float:At,floatExp:kt,floatNaN:St,floatTime:Ct,int:vt,intHex:Et,intOct:Nt,intTime:Lt,map:z,merge:W,null:be,omap:He,pairs:Ye,seq:Q,set:ze,timestamp:Ce},Ys={"tag:yaml.org,2002:binary":Je,"tag:yaml.org,2002:merge":W,"tag:yaml.org,2002:omap":He,"tag:yaml.org,2002:pairs":Ye,"tag:yaml.org,2002:set":ze,"tag:yaml.org,2002:timestamp":Ce};function Tt(s,e,t){let n=Vs.get(e);if(n&&!s)return t&&!n.includes(W)?n.concat(W):n.slice();let i=n;if(!i)if(Array.isArray(s))i=[];else{let o=Array.from(Vs.keys()).filter(r=>r!=="yaml11").map(r=>JSON.stringify(r)).join(", ");throw new Error(`Unknown schema "${e}"; use one of ${o} or define customTags array`)}if(Array.isArray(s))for(let o of s)i=i.concat(o);else typeof s=="function"&&(i=s(i.slice()));return t&&(i=i.concat(W)),i.reduce((o,r)=>{let a=typeof r=="string"?Js[r]:r;if(!a){let l=JSON.stringify(r),c=Object.keys(Js).map(d=>JSON.stringify(d)).join(", ");throw new Error(`Unknown custom tag ${l}; use one of ${c}`)}return o.includes(a)||o.push(a),o},[])}var Jn=(s,e)=>s.key<e.key?-1:s.key>e.key?1:0,Te=class s{constructor({compat:e,customTags:t,merge:n,resolveKnownTags:i,schema:o,sortMapEntries:r,toStringDefaults:a}){this.compat=Array.isArray(e)?Tt(e,"compat"):e?Tt(null,e):null,this.name=typeof o=="string"&&o||"core",this.knownTags=i?Ys:{},this.tags=Tt(t,this.name,n),this.toStringOptions=a??null,Object.defineProperty(this,Y,{value:z}),Object.defineProperty(this,j,{value:he}),Object.defineProperty(this,re,{value:Q}),this.sortMapEntries=typeof r=="function"?r:r===!0?Jn:null}clone(){let e=Object.create(s.prototype,Object.getOwnPropertyDescriptors(this));return e.tags=this.tags.slice(),e}};function Hs(s,e){let t=[],n=e.directives===!0;if(e.directives!==!1&&s.directives){let l=s.directives.toString(s);l?(t.push(l),n=!0):s.directives.docStart&&(n=!0)}n&&t.push("---");let i=dt(s,e),{commentString:o}=i.options;if(s.commentBefore){t.length!==1&&t.unshift("");let l=o(s.commentBefore);t.unshift(V(l,""))}let r=!1,a=null;if(s.contents){if(O(s.contents)){if(s.contents.spaceBefore&&n&&t.push(""),s.contents.commentBefore){let d=o(s.contents.commentBefore);t.push(V(d,""))}i.forceBlockIndent=!!s.comment,a=s.contents.comment}let l=a?void 0:()=>r=!0,c=ce(s.contents,i,()=>a=null,l);a&&(c+=se(c,"",o(a))),(c[0]==="|"||c[0]===">")&&t[t.length-1]==="---"?t[t.length-1]=`--- ${c}`:t.push(c)}else t.push(ce(s.contents,i));if(s.directives?.docEnd)if(s.comment){let l=o(s.comment);l.includes(`
`)?(t.push("..."),t.push(V(l,""))):t.push(`... ${l}`)}else t.push("...");else{let l=s.comment;l&&r&&(l=l.replace(/^\n+/,"")),l&&((!r||a)&&t[t.length-1]!==""&&t.push(""),t.push(V(o(l),"")))}return t.join(`
`)+`
`}var ne=class s{constructor(e,t,n){this.commentBefore=null,this.comment=null,this.errors=[],this.warnings=[],Object.defineProperty(this,B,{value:it});let i=null;typeof t=="function"||Array.isArray(t)?i=t:n===void 0&&t&&(n=t,t=void 0);let o=Object.assign({intAsBigInt:!1,keepSourceTokens:!1,logLevel:"warn",prettyErrors:!0,strict:!0,stringKeys:!1,uniqueKeys:!0,version:"1.2"},n);this.options=o;let{version:r}=o;n?._directives?(this.directives=n._directives.atDocument(),this.directives.yaml.explicit&&(r=this.directives.yaml.version)):this.directives=new ee({version:r}),this.setSchema(r,n),this.contents=e===void 0?null:this.createNode(e,i,n)}clone(){let e=Object.create(s.prototype,{[B]:{value:it}});return e.commentBefore=this.commentBefore,e.comment=this.comment,e.errors=this.errors.slice(),e.warnings=this.warnings.slice(),e.options=Object.assign({},this.options),this.directives&&(e.directives=this.directives.clone()),e.schema=this.schema.clone(),e.contents=O(this.contents)?this.contents.clone(e.schema):this.contents,this.range&&(e.range=this.range.slice()),e}add(e){Ie(this.contents)&&this.contents.add(e)}addIn(e,t){Ie(this.contents)&&this.contents.addIn(e,t)}createAlias(e,t){if(!e.anchor){let n=Jt(this);e.anchor=!t||n.has(t)?Yt(t||"a",n):t}return new te(e.anchor)}createNode(e,t,n){let i;if(typeof t=="function")e=t.call({"":e},"",e),i=t;else if(Array.isArray(t)){let h=S=>typeof S=="number"||S instanceof String||S instanceof Number,w=t.filter(h).map(String);w.length>0&&(t=t.concat(w)),i=t}else n===void 0&&t&&(n=t,t=void 0);let{aliasDuplicateObjects:o,anchorPrefix:r,flow:a,keepUndefined:l,onTagObj:c,tag:d}=n??{},{onAnchor:f,setAnchors:u,sourceObjects:m}=Os(this,r||"a"),g={aliasDuplicateObjects:o??!0,keepUndefined:l??!1,onAnchor:f,onTagObj:c,replacer:i,schema:this.schema,sourceObjects:m},p=ae(e,d,g);return a&&_(p)&&(p.flow=!0),u(),p}createPair(e,t,n={}){let i=this.createNode(e,null,n),o=this.createNode(t,null,n);return new C(i,o)}delete(e){return Ie(this.contents)?this.contents.delete(e):!1}deleteIn(e){return ve(e)?this.contents==null?!1:(this.contents=null,!0):Ie(this.contents)?this.contents.deleteIn(e):!1}get(e,t){return _(this.contents)?this.contents.get(e,t):void 0}getIn(e,t){return ve(e)?!t&&v(this.contents)?this.contents.value:this.contents:_(this.contents)?this.contents.getIn(e,t):void 0}has(e){return _(this.contents)?this.contents.has(e):!1}hasIn(e){return ve(e)?this.contents!==void 0:_(this.contents)?this.contents.hasIn(e):!1}set(e,t){this.contents==null?this.contents=qe(this.schema,[e],t):Ie(this.contents)&&this.contents.set(e,t)}setIn(e,t){ve(e)?this.contents=t:this.contents==null?this.contents=qe(this.schema,Array.from(e),t):Ie(this.contents)&&this.contents.setIn(e,t)}setSchema(e,t={}){typeof e=="number"&&(e=String(e));let n;switch(e){case"1.1":this.directives?this.directives.yaml.version="1.1":this.directives=new ee({version:"1.1"}),n={resolveKnownTags:!1,schema:"yaml-1.1"};break;case"1.2":case"next":this.directives?this.directives.yaml.version=e:this.directives=new ee({version:e}),n={resolveKnownTags:!0,schema:"core"};break;case null:this.directives&&delete this.directives,n=null;break;default:{let i=JSON.stringify(e);throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${i}`)}}if(t.schema instanceof Object)this.schema=t.schema;else if(n)this.schema=new Te(Object.assign(n,t));else throw new Error("With a null YAML version, the { schema: Schema } option is required")}toJS({json:e,jsonArg:t,mapAsMap:n,maxAliasCount:i,onAnchor:o,reviver:r}={}){let a={anchors:new Map,doc:this,keep:!e,mapAsMap:n===!0,mapKeyWarned:!1,maxAliasCount:typeof i=="number"?i:100},l=$(this.contents,t??"",a);if(typeof o=="function")for(let{count:c,res:d}of a.anchors.values())o(d,c);return typeof r=="function"?ue(r,{"":l},"",l):l}toJSON(e,t){return this.toJS({json:!0,jsonArg:e,mapAsMap:!1,onAnchor:t})}toString(e={}){if(this.errors.length>0)throw new Error("Document with errors cannot be stringified");if("indent"in e&&(!Number.isInteger(e.indent)||Number(e.indent)<=0)){let t=JSON.stringify(e.indent);throw new Error(`"indent" option must be a positive integer, not ${t}`)}return Hs(this,e)}};function Ie(s){if(_(s))return!0;throw new Error("Expected a YAML collection as document contents")}var Me=class extends Error{constructor(e,t,n,i){super(),this.name=e,this.code=n,this.message=i,this.pos=t}},q=class extends Me{constructor(e,t,n){super("YAMLParseError",e,t,n)}},$e=class extends Me{constructor(e,t,n){super("YAMLWarning",e,t,n)}},Qe=(s,e)=>t=>{if(t.pos[0]===-1)return;t.linePos=t.pos.map(a=>e.linePos(a));let{line:n,col:i}=t.linePos[0];t.message+=` at line ${n}, column ${i}`;let o=i-1,r=s.substring(e.lineStarts[n-1],e.lineStarts[n]).replace(/[\n\r]+$/,"");if(o>=60&&r.length>80){let a=Math.min(o-39,r.length-79);r="\u2026"+r.substring(a),o-=a-1}if(r.length>80&&(r=r.substring(0,79)+"\u2026"),n>1&&/^ *$/.test(r.substring(0,o))){let a=s.substring(e.lineStarts[n-2],e.lineStarts[n-1]);a.length>80&&(a=a.substring(0,79)+`\u2026
`),r=a+r}if(/[^ ]/.test(r)){let a=1,l=t.linePos[1];l&&l.line===n&&l.col>i&&(a=Math.max(1,Math.min(l.col-i,80-o)));let c=" ".repeat(o)+"^".repeat(a);t.message+=`:

${r}
${c}
`}};function ie(s,{flow:e,indicator:t,next:n,offset:i,onError:o,parentIndent:r,startOnNewline:a}){let l=!1,c=a,d=a,f="",u="",m=!1,g=!1,p=null,h=null,w=null,S=null,k=null,A=null,x=null;for(let b of s)switch(g&&(b.type!=="space"&&b.type!=="newline"&&b.type!=="comma"&&o(b.offset,"MISSING_CHAR","Tags and anchors must be separated from the next token by white space"),g=!1),p&&(c&&b.type!=="comment"&&b.type!=="newline"&&o(p,"TAB_AS_INDENT","Tabs are not allowed as indentation"),p=null),b.type){case"space":!e&&(t!=="doc-start"||n?.type!=="flow-collection")&&b.source.includes("	")&&(p=b),d=!0;break;case"comment":{d||o(b,"MISSING_CHAR","Comments must be separated from other tokens by white space characters");let I=b.source.substring(1)||" ";f?f+=u+I:f=I,u="",c=!1;break}case"newline":c?f?f+=b.source:(!A||t!=="seq-item-ind")&&(l=!0):u+=b.source,c=!0,m=!0,(h||w)&&(S=b),d=!0;break;case"anchor":h&&o(b,"MULTIPLE_ANCHORS","A node can have at most one anchor"),b.source.endsWith(":")&&o(b.offset+b.source.length-1,"BAD_ALIAS","Anchor ending in : is ambiguous",!0),h=b,x??(x=b.offset),c=!1,d=!1,g=!0;break;case"tag":{w&&o(b,"MULTIPLE_TAGS","A node can have at most one tag"),w=b,x??(x=b.offset),c=!1,d=!1,g=!0;break}case t:(h||w)&&o(b,"BAD_PROP_ORDER",`Anchors and tags must be after the ${b.source} indicator`),A&&o(b,"UNEXPECTED_TOKEN",`Unexpected ${b.source} in ${e??"collection"}`),A=b,c=t==="seq-item-ind"||t==="explicit-key-ind",d=!1;break;case"comma":if(e){k&&o(b,"UNEXPECTED_TOKEN",`Unexpected , in ${e}`),k=b,c=!1,d=!1;break}default:o(b,"UNEXPECTED_TOKEN",`Unexpected ${b.type} token`),c=!1,d=!1}let N=s[s.length-1],L=N?N.offset+N.source.length:i;return g&&n&&n.type!=="space"&&n.type!=="newline"&&n.type!=="comma"&&(n.type!=="scalar"||n.source!=="")&&o(n.offset,"MISSING_CHAR","Tags and anchors must be separated from the next token by white space"),p&&(c&&p.indent<=r||n?.type==="block-map"||n?.type==="block-seq")&&o(p,"TAB_AS_INDENT","Tabs are not allowed as indentation"),{comma:k,found:A,spaceBefore:l,comment:f,hasNewline:m,anchor:h,tag:w,newlineAfterProp:S,end:L,start:x??L}}function me(s){if(!s)return null;switch(s.type){case"alias":case"scalar":case"double-quoted-scalar":case"single-quoted-scalar":if(s.source.includes(`
`))return!0;if(s.end){for(let e of s.end)if(e.type==="newline")return!0}return!1;case"flow-collection":for(let e of s.items){for(let t of e.start)if(t.type==="newline")return!0;if(e.sep){for(let t of e.sep)if(t.type==="newline")return!0}if(me(e.key)||me(e.value))return!0}return!1;default:return!0}}function Xe(s,e,t){if(e?.type==="flow-collection"){let n=e.end[0];n.indent===s&&(n.source==="]"||n.source==="}")&&me(e)&&t(n,"BAD_INDENT","Flow end indicator should be more indented than parent",!0)}}function It(s,e,t){let{uniqueKeys:n}=s.options;if(n===!1)return!1;let i=typeof n=="function"?n:(o,r)=>o===r||v(o)&&v(r)&&o.value===r.value;return e.some(o=>i(o.key,t))}var Ws="All mapping items must start at the same column";function zs({composeNode:s,composeEmptyNode:e},t,n,i,o){let r=o?.nodeClass??T,a=new r(t.schema);t.atRoot&&(t.atRoot=!1);let l=n.offset,c=null;for(let d of n.items){let{start:f,key:u,sep:m,value:g}=d,p=ie(f,{indicator:"explicit-key-ind",next:u??m?.[0],offset:l,onError:i,parentIndent:n.indent,startOnNewline:!0}),h=!p.found;if(h){if(u&&(u.type==="block-seq"?i(l,"BLOCK_AS_IMPLICIT_KEY","A block sequence may not be used as an implicit map key"):"indent"in u&&u.indent!==n.indent&&i(l,"BAD_INDENT",Ws)),!p.anchor&&!p.tag&&!m){c=p.end,p.comment&&(a.comment?a.comment+=`
`+p.comment:a.comment=p.comment);continue}(p.newlineAfterProp||me(u))&&i(u??f[f.length-1],"MULTILINE_IMPLICIT_KEY","Implicit keys need to be on a single line")}else p.found?.indent!==n.indent&&i(l,"BAD_INDENT",Ws);t.atKey=!0;let w=p.end,S=u?s(t,u,p,i):e(t,w,f,null,p,i);t.schema.compat&&Xe(n.indent,u,i),t.atKey=!1,It(t,a.items,S)&&i(w,"DUPLICATE_KEY","Map keys must be unique");let k=ie(m??[],{indicator:"map-value-ind",next:g,offset:S.range[2],onError:i,parentIndent:n.indent,startOnNewline:!u||u.type==="block-scalar"});if(l=k.end,k.found){h&&(g?.type==="block-map"&&!k.hasNewline&&i(l,"BLOCK_AS_IMPLICIT_KEY","Nested mappings are not allowed in compact mappings"),t.options.strict&&p.start<k.found.offset-1024&&i(S.range,"KEY_OVER_1024_CHARS","The : indicator must be at most 1024 chars after the start of an implicit block mapping key"));let A=g?s(t,g,k,i):e(t,l,m,null,k,i);t.schema.compat&&Xe(n.indent,g,i),l=A.range[2];let x=new C(S,A);t.options.keepSourceTokens&&(x.srcToken=d),a.items.push(x)}else{h&&i(S.range,"MISSING_CHAR","Implicit map keys need to be followed by map values"),k.comment&&(S.comment?S.comment+=`
`+k.comment:S.comment=k.comment);let A=new C(S);t.options.keepSourceTokens&&(A.srcToken=d),a.items.push(A)}}return c&&c<l&&i(c,"IMPOSSIBLE","Map comment with trailing content"),a.range=[n.offset,l,c??l],a}function Qs({composeNode:s,composeEmptyNode:e},t,n,i,o){let r=o?.nodeClass??P,a=new r(t.schema);t.atRoot&&(t.atRoot=!1),t.atKey&&(t.atKey=!1);let l=n.offset,c=null;for(let{start:d,value:f}of n.items){let u=ie(d,{indicator:"seq-item-ind",next:f,offset:l,onError:i,parentIndent:n.indent,startOnNewline:!0});if(!u.found)if(u.anchor||u.tag||f)f&&f.type==="block-seq"?i(u.end,"BAD_INDENT","All sequence items must start at the same column"):i(l,"MISSING_CHAR","Sequence item without - indicator");else{c=u.end,u.comment&&(a.comment=u.comment);continue}let m=f?s(t,f,u,i):e(t,u.end,d,null,u,i);t.schema.compat&&Xe(n.indent,f,i),l=m.range[2],a.items.push(m)}return a.range=[n.offset,l,c??l],a}function oe(s,e,t,n){let i="";if(s){let o=!1,r="";for(let a of s){let{source:l,type:c}=a;switch(c){case"space":o=!0;break;case"comment":{t&&!o&&n(a,"MISSING_CHAR","Comments must be separated from other tokens by white space characters");let d=l.substring(1)||" ";i?i+=r+d:i=d,r="";break}case"newline":i&&(r+=l),o=!0;break;default:n(a,"UNEXPECTED_TOKEN",`Unexpected ${c} at node end`)}e+=l.length}}return{comment:i,offset:e}}var as="Block collections are not allowed within flow collections",ls=s=>s&&(s.type==="block-map"||s.type==="block-seq");function Xs({composeNode:s,composeEmptyNode:e},t,n,i,o){let r=n.start.source==="{",a=r?"flow map":"flow sequence",l=o?.nodeClass??(r?T:P),c=new l(t.schema);c.flow=!0;let d=t.atRoot;d&&(t.atRoot=!1),t.atKey&&(t.atKey=!1);let f=n.offset+n.start.source.length;for(let h=0;h<n.items.length;++h){let w=n.items[h],{start:S,key:k,sep:A,value:x}=w,N=ie(S,{flow:a,indicator:"explicit-key-ind",next:k??A?.[0],offset:f,onError:i,parentIndent:n.indent,startOnNewline:!1});if(!N.found){if(!N.anchor&&!N.tag&&!A&&!x){h===0&&N.comma?i(N.comma,"UNEXPECTED_TOKEN",`Unexpected , in ${a}`):h<n.items.length-1&&i(N.start,"UNEXPECTED_TOKEN",`Unexpected empty item in ${a}`),N.comment&&(c.comment?c.comment+=`
`+N.comment:c.comment=N.comment),f=N.end;continue}!r&&t.options.strict&&me(k)&&i(k,"MULTILINE_IMPLICIT_KEY","Implicit keys of flow sequence pairs need to be on a single line")}if(h===0)N.comma&&i(N.comma,"UNEXPECTED_TOKEN",`Unexpected , in ${a}`);else if(N.comma||i(N.start,"MISSING_CHAR",`Missing , between ${a} items`),N.comment){let L="";e:for(let b of S)switch(b.type){case"comma":case"space":break;case"comment":L=b.source.substring(1);break e;default:break e}if(L){let b=c.items[c.items.length-1];E(b)&&(b=b.value??b.key),b.comment?b.comment+=`
`+L:b.comment=L,N.comment=N.comment.substring(L.length+1)}}if(!r&&!A&&!N.found){let L=x?s(t,x,N,i):e(t,N.end,A,null,N,i);c.items.push(L),f=L.range[2],ls(x)&&i(L.range,"BLOCK_IN_FLOW",as)}else{t.atKey=!0;let L=N.end,b=k?s(t,k,N,i):e(t,L,S,null,N,i);ls(k)&&i(b.range,"BLOCK_IN_FLOW",as),t.atKey=!1;let I=ie(A??[],{flow:a,indicator:"map-value-ind",next:x,offset:b.range[2],onError:i,parentIndent:n.indent,startOnNewline:!1});if(I.found){if(!r&&!N.found&&t.options.strict){if(A)for(let M of A){if(M===I.found)break;if(M.type==="newline"){i(M,"MULTILINE_IMPLICIT_KEY","Implicit keys of flow sequence pairs need to be on a single line");break}}N.start<I.found.offset-1024&&i(I.found,"KEY_OVER_1024_CHARS","The : indicator must be at most 1024 chars after the start of an implicit flow sequence key")}}else x&&("source"in x&&x.source&&x.source[0]===":"?i(x,"MISSING_CHAR",`Missing space after : in ${a}`):i(I.start,"MISSING_CHAR",`Missing , or : between ${a} items`));let fe=x?s(t,x,I,i):I.found?e(t,I.end,A,null,I,i):null;fe?ls(x)&&i(fe.range,"BLOCK_IN_FLOW",as):I.comment&&(b.comment?b.comment+=`
`+I.comment:b.comment=I.comment);let ke=new C(b,fe);if(t.options.keepSourceTokens&&(ke.srcToken=w),r){let M=c;It(t,M.items,b)&&i(L,"DUPLICATE_KEY","Map keys must be unique"),M.items.push(ke)}else{let M=new T(t.schema);M.flow=!0,M.items.push(ke);let ks=(fe??b).range;M.range=[b.range[0],ks[1],ks[2]],c.items.push(M)}f=fe?fe.range[2]:I.end}}let u=r?"}":"]",[m,...g]=n.end,p=f;if(m&&m.source===u)p=m.offset+m.source.length;else{let h=a[0].toUpperCase()+a.substring(1),w=d?`${h} must end with a ${u}`:`${h} in block collection must be sufficiently indented and end with a ${u}`;i(f,d?"MISSING_CHAR":"BAD_INDENT",w),m&&m.source.length!==1&&g.unshift(m)}if(g.length>0){let h=oe(g,p,t.options.strict,i);h.comment&&(c.comment?c.comment+=`
`+h.comment:c.comment=h.comment),c.range=[n.offset,p,h.offset]}else c.range=[n.offset,p,p];return c}function cs(s,e,t,n,i,o){let r=t.type==="block-map"?zs(s,e,t,n,o):t.type==="block-seq"?Qs(s,e,t,n,o):Xs(s,e,t,n,o),a=r.constructor;return i==="!"||i===a.tagName?(r.tag=a.tagName,r):(i&&(r.tag=i),r)}function Zs(s,e,t,n,i){let o=n.tag,r=o?e.directives.tagName(o.source,u=>i(o,"TAG_RESOLVE_FAILED",u)):null;if(t.type==="block-seq"){let{anchor:u,newlineAfterProp:m}=n,g=u&&o?u.offset>o.offset?u:o:u??o;g&&(!m||m.offset<g.offset)&&i(g,"MISSING_CHAR","Missing newline after block sequence props")}let a=t.type==="block-map"?"map":t.type==="block-seq"?"seq":t.start.source==="{"?"map":"seq";if(!o||!r||r==="!"||r===T.tagName&&a==="map"||r===P.tagName&&a==="seq")return cs(s,e,t,i,r);let l=e.schema.tags.find(u=>u.tag===r&&u.collection===a);if(!l){let u=e.schema.knownTags[r];if(u&&u.collection===a)e.schema.tags.push(Object.assign({},u,{default:!1})),l=u;else return u?i(o,"BAD_COLLECTION_TYPE",`${u.tag} used for ${a} collection, but expects ${u.collection??"scalar"}`,!0):i(o,"TAG_RESOLVE_FAILED",`Unresolved tag: ${r}`,!0),cs(s,e,t,i,r)}let c=cs(s,e,t,i,r,l),d=l.resolve?.(c,u=>i(o,"TAG_RESOLVE_FAILED",u),e.options)??c,f=O(d)?d:new y(d);return f.range=c.range,f.tag=r,l?.format&&(f.format=l.format),f}function Mt(s,e,t){let n=e.offset,i=Yn(e,s.options.strict,t);if(!i)return{value:"",type:null,comment:"",range:[n,n,n]};let o=i.mode===">"?y.BLOCK_FOLDED:y.BLOCK_LITERAL,r=e.source?Hn(e.source):[],a=r.length;for(let p=r.length-1;p>=0;--p){let h=r[p][1];if(h===""||h==="\r")a=p;else break}if(a===0){let p=i.chomp==="+"&&r.length>0?`
`.repeat(Math.max(1,r.length-1)):"",h=n+i.length;return e.source&&(h+=e.source.length),{value:p,type:o,comment:i.comment,range:[n,h,h]}}let l=e.indent+i.indent,c=e.offset+i.length,d=0;for(let p=0;p<a;++p){let[h,w]=r[p];if(w===""||w==="\r")i.indent===0&&h.length>l&&(l=h.length);else{h.length<l&&t(c+h.length,"MISSING_CHAR","Block scalars with more-indented leading empty lines must use an explicit indentation indicator"),i.indent===0&&(l=h.length),d=p,l===0&&!s.atRoot&&t(c,"BAD_INDENT","Block scalar values in collections must be indented");break}c+=h.length+w.length+1}for(let p=r.length-1;p>=a;--p)r[p][0].length>l&&(a=p+1);let f="",u="",m=!1;for(let p=0;p<d;++p)f+=r[p][0].slice(l)+`
`;for(let p=d;p<a;++p){let[h,w]=r[p];c+=h.length+w.length+1;let S=w[w.length-1]==="\r";if(S&&(w=w.slice(0,-1)),w&&h.length<l){let A=`Block scalar lines must not be less indented than their ${i.indent?"explicit indentation indicator":"first line"}`;t(c-w.length-(S?2:1),"BAD_INDENT",A),h=""}o===y.BLOCK_LITERAL?(f+=u+h.slice(l)+w,u=`
`):h.length>l||w[0]==="	"?(u===" "?u=`
`:!m&&u===`
`&&(u=`

`),f+=u+h.slice(l)+w,u=`
`,m=!0):w===""?u===`
`?f+=`
`:u=`
`:(f+=u+w,u=" ",m=!1)}switch(i.chomp){case"-":break;case"+":for(let p=a;p<r.length;++p)f+=`
`+r[p][0].slice(l);f[f.length-1]!==`
`&&(f+=`
`);break;default:f+=`
`}let g=n+i.length+e.source.length;return{value:f,type:o,comment:i.comment,range:[n,g,g]}}function Yn({offset:s,props:e},t,n){if(e[0].type!=="block-scalar-header")return n(e[0],"IMPOSSIBLE","Block scalar header not found"),null;let{source:i}=e[0],o=i[0],r=0,a="",l=-1;for(let u=1;u<i.length;++u){let m=i[u];if(!a&&(m==="-"||m==="+"))a=m;else{let g=Number(m);!r&&g?r=g:l===-1&&(l=s+u)}}l!==-1&&n(l,"UNEXPECTED_TOKEN",`Block scalar header includes extra characters: ${i}`);let c=!1,d="",f=i.length;for(let u=1;u<e.length;++u){let m=e[u];switch(m.type){case"space":c=!0;case"newline":f+=m.source.length;break;case"comment":t&&!c&&n(m,"MISSING_CHAR","Comments must be separated from other tokens by white space characters"),f+=m.source.length,d=m.source.substring(1);break;case"error":n(m,"UNEXPECTED_TOKEN",m.message),f+=m.source.length;break;default:{let g=`Unexpected token in block scalar header: ${m.type}`;n(m,"UNEXPECTED_TOKEN",g);let p=m.source;p&&typeof p=="string"&&(f+=p.length)}}}return{mode:o,indent:r,chomp:a,comment:d,length:f}}function Hn(s){let e=s.split(/\n( *)/),t=e[0],n=t.match(/^( *)/),o=[n?.[1]?[n[1],t.slice(n[1].length)]:["",t]];for(let r=1;r<e.length;r+=2)o.push([e[r],e[r+1]]);return o}function $t(s,e,t){let{offset:n,type:i,source:o,end:r}=s,a,l,c=(u,m,g)=>t(n+u,m,g);switch(i){case"scalar":a=y.PLAIN,l=Wn(o,c);break;case"single-quoted-scalar":a=y.QUOTE_SINGLE,l=zn(o,c);break;case"double-quoted-scalar":a=y.QUOTE_DOUBLE,l=Qn(o,c);break;default:return t(s,"UNEXPECTED_TOKEN",`Expected a flow scalar value, but found: ${i}`),{value:"",type:null,comment:"",range:[n,n+o.length,n+o.length]}}let d=n+o.length,f=oe(r,d,e,t);return{value:l,type:a,comment:f.comment,range:[n,d,f.offset]}}function Wn(s,e){let t="";switch(s[0]){case"	":t="a tab character";break;case",":t="flow indicator character ,";break;case"%":t="directive indicator character %";break;case"|":case">":{t=`block scalar indicator ${s[0]}`;break}case"@":case"`":{t=`reserved character ${s[0]}`;break}}return t&&e(0,"BAD_SCALAR_START",`Plain value cannot start with ${t}`),en(s)}function zn(s,e){return(s[s.length-1]!=="'"||s.length===1)&&e(s.length,"MISSING_CHAR","Missing closing 'quote"),en(s.slice(1,-1)).replace(/''/g,"'")}function en(s){let e,t;try{e=new RegExp(`(.*?)(?<![ 	])[ 	]*\r?
`,"sy"),t=new RegExp(`[ 	]*(.*?)(?:(?<![ 	])[ 	]*)?\r?
`,"sy")}catch{e=/(.*?)[ \t]*\r?\n/sy,t=/[ \t]*(.*?)[ \t]*\r?\n/sy}let n=e.exec(s);if(!n)return s;let i=n[1],o=" ",r=e.lastIndex;for(t.lastIndex=r;n=t.exec(s);)n[1]===""?o===`
`?i+=o:o=`
`:(i+=o+n[1],o=" "),r=t.lastIndex;let a=/[ \t]*(.*)/sy;return a.lastIndex=r,n=a.exec(s),i+o+(n?.[1]??"")}function Qn(s,e){let t="";for(let n=1;n<s.length-1;++n){let i=s[n];if(!(i==="\r"&&s[n+1]===`
`))if(i===`
`){let{fold:o,offset:r}=Xn(s,n);t+=o,n=r}else if(i==="\\"){let o=s[++n],r=Zn[o];if(r)t+=r;else if(o===`
`)for(o=s[n+1];o===" "||o==="	";)o=s[++n+1];else if(o==="\r"&&s[n+1]===`
`)for(o=s[++n+1];o===" "||o==="	";)o=s[++n+1];else if(o==="x"||o==="u"||o==="U"){let a={x:2,u:4,U:8}[o];t+=ei(s,n+1,a,e),n+=a}else{let a=s.substr(n-1,2);e(n-1,"BAD_DQ_ESCAPE",`Invalid escape sequence ${a}`),t+=a}}else if(i===" "||i==="	"){let o=n,r=s[n+1];for(;r===" "||r==="	";)r=s[++n+1];r!==`
`&&!(r==="\r"&&s[n+2]===`
`)&&(t+=n>o?s.slice(o,n+1):i)}else t+=i}return(s[s.length-1]!=='"'||s.length===1)&&e(s.length,"MISSING_CHAR",'Missing closing "quote'),t}function Xn(s,e){let t="",n=s[e+1];for(;(n===" "||n==="	"||n===`
`||n==="\r")&&!(n==="\r"&&s[e+2]!==`
`);)n===`
`&&(t+=`
`),e+=1,n=s[e+1];return t||(t=" "),{fold:t,offset:e}}var Zn={0:"\0",a:"\x07",b:"\b",e:"\x1B",f:"\f",n:`
`,r:"\r",t:"	",v:"\v",N:"\x85",_:"\xA0",L:"\u2028",P:"\u2029"," ":" ",'"':'"',"/":"/","\\":"\\","	":"	"};function ei(s,e,t,n){let i=s.substr(e,t),r=i.length===t&&/^[0-9a-fA-F]+$/.test(i)?parseInt(i,16):NaN;if(isNaN(r)){let a=s.substr(e-2,t+2);return n(e-2,"BAD_DQ_ESCAPE",`Invalid escape sequence ${a}`),a}return String.fromCodePoint(r)}function fs(s,e,t,n){let{value:i,type:o,comment:r,range:a}=e.type==="block-scalar"?Mt(s,e,n):$t(e,s.options.strict,n),l=t?s.directives.tagName(t.source,f=>n(t,"TAG_RESOLVE_FAILED",f)):null,c;s.options.stringKeys&&s.atKey?c=s.schema[j]:l?c=ti(s.schema,i,l,t,n):e.type==="scalar"?c=si(s,i,e,n):c=s.schema[j];let d;try{let f=c.resolve(i,u=>n(t??e,"TAG_RESOLVE_FAILED",u),s.options);d=v(f)?f:new y(f)}catch(f){let u=f instanceof Error?f.message:String(f);n(t??e,"TAG_RESOLVE_FAILED",u),d=new y(i)}return d.range=a,d.source=i,o&&(d.type=o),l&&(d.tag=l),c.format&&(d.format=c.format),r&&(d.comment=r),d}function ti(s,e,t,n,i){if(t==="!")return s[j];let o=[];for(let a of s.tags)if(!a.collection&&a.tag===t)if(a.default&&a.test)o.push(a);else return a;for(let a of o)if(a.test?.test(e))return a;let r=s.knownTags[t];return r&&!r.collection?(s.tags.push(Object.assign({},r,{default:!1,test:void 0})),r):(i(n,"TAG_RESOLVE_FAILED",`Unresolved tag: ${t}`,t!=="tag:yaml.org,2002:str"),s[j])}function si({atKey:s,directives:e,schema:t},n,i,o){let r=t.tags.find(a=>(a.default===!0||s&&a.default==="key")&&a.test?.test(n))||t[j];if(t.compat){let a=t.compat.find(l=>l.default&&l.test?.test(n))??t[j];if(r.tag!==a.tag){let l=e.tagString(r.tag),c=e.tagString(a.tag),d=`Value may be parsed as either ${l} or ${c}`;o(i,"TAG_RESOLVE_FAILED",d,!0)}}return r}function tn(s,e,t){if(e){t??(t=e.length);for(let n=t-1;n>=0;--n){let i=e[n];switch(i.type){case"space":case"comment":case"newline":s-=i.source.length;continue}for(i=e[++n];i?.type==="space";)s+=i.source.length,i=e[++n];break}}return s}var ni={composeNode:us,composeEmptyNode:Pt};function us(s,e,t,n){let i=s.atKey,{spaceBefore:o,comment:r,anchor:a,tag:l}=t,c,d=!0;switch(e.type){case"alias":c=ii(s,e,n),(a||l)&&n(e,"ALIAS_PROPS","An alias node must not specify any properties");break;case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":case"block-scalar":c=fs(s,e,l,n),a&&(c.anchor=a.source.substring(1));break;case"block-map":case"block-seq":case"flow-collection":c=Zs(ni,s,e,t,n),a&&(c.anchor=a.source.substring(1));break;default:{let f=e.type==="error"?e.message:`Unsupported token (type: ${e.type})`;n(e,"UNEXPECTED_TOKEN",f),c=Pt(s,e.offset,void 0,null,t,n),d=!1}}return a&&c.anchor===""&&n(a,"BAD_ALIAS","Anchor cannot be an empty string"),i&&s.options.stringKeys&&(!v(c)||typeof c.value!="string"||c.tag&&c.tag!=="tag:yaml.org,2002:str")&&n(l??e,"NON_STRING_KEY","With stringKeys, all keys must be strings"),o&&(c.spaceBefore=!0),r&&(e.type==="scalar"&&e.source===""?c.comment=r:c.commentBefore=r),s.options.keepSourceTokens&&d&&(c.srcToken=e),c}function Pt(s,e,t,n,{spaceBefore:i,comment:o,anchor:r,tag:a,end:l},c){let d={type:"scalar",offset:tn(e,t,n),indent:-1,source:""},f=fs(s,d,a,c);return r&&(f.anchor=r.source.substring(1),f.anchor===""&&c(r,"BAD_ALIAS","Anchor cannot be an empty string")),i&&(f.spaceBefore=!0),o&&(f.comment=o,f.range[2]=l),f}function ii({options:s},{offset:e,source:t,end:n},i){let o=new te(t.substring(1));o.source===""&&i(e,"BAD_ALIAS","Alias cannot be an empty string"),o.source.endsWith(":")&&i(e+t.length-1,"BAD_ALIAS","Alias ending in : is ambiguous",!0);let r=e+t.length,a=oe(n,r,s.strict,i);return o.range=[e,r,a.offset],a.comment&&(o.comment=a.comment),o}function sn(s,e,{offset:t,start:n,value:i,end:o},r){let a=Object.assign({_directives:e},s),l=new ne(void 0,a),c={atKey:!1,atRoot:!0,directives:l.directives,options:l.options,schema:l.schema},d=ie(n,{indicator:"doc-start",next:i??o?.[0],offset:t,onError:r,parentIndent:0,startOnNewline:!0});d.found&&(l.directives.docStart=!0,i&&(i.type==="block-map"||i.type==="block-seq")&&!d.hasNewline&&r(d.end,"MISSING_CHAR","Block collection cannot start on same line with directives-end marker")),l.contents=i?us(c,i,d,r):Pt(c,d.end,n,null,d,r);let f=l.contents.range[2],u=oe(o,f,!1,r);return u.comment&&(l.comment=u.comment),l.range=[t,f,u.offset],l}function Ze(s){if(typeof s=="number")return[s,s+1];if(Array.isArray(s))return s.length===2?s:[s[0],s[1]];let{offset:e,source:t}=s;return[e,e+(typeof t=="string"?t.length:1)]}function nn(s){let e="",t=!1,n=!1;for(let i=0;i<s.length;++i){let o=s[i];switch(o[0]){case"#":e+=(e===""?"":n?`

`:`
`)+(o.substring(1)||" "),t=!0,n=!1;break;case"%":s[i+1]?.[0]!=="#"&&(i+=1),t=!1;break;default:t||(n=!0),t=!1}}return{comment:e,afterEmptyLine:n}}var we=class{constructor(e={}){this.doc=null,this.atDirectives=!1,this.prelude=[],this.errors=[],this.warnings=[],this.onError=(t,n,i,o)=>{let r=Ze(t);o?this.warnings.push(new $e(r,n,i)):this.errors.push(new q(r,n,i))},this.directives=new ee({version:e.version||"1.2"}),this.options=e}decorate(e,t){let{comment:n,afterEmptyLine:i}=nn(this.prelude);if(n){let o=e.contents;if(t)e.comment=e.comment?`${e.comment}
${n}`:n;else if(i||e.directives.docStart||!o)e.commentBefore=n;else if(_(o)&&!o.flow&&o.items.length>0){let r=o.items[0];E(r)&&(r=r.key);let a=r.commentBefore;r.commentBefore=a?`${n}
${a}`:n}else{let r=o.commentBefore;o.commentBefore=r?`${n}
${r}`:n}}t?(Array.prototype.push.apply(e.errors,this.errors),Array.prototype.push.apply(e.warnings,this.warnings)):(e.errors=this.errors,e.warnings=this.warnings),this.prelude=[],this.errors=[],this.warnings=[]}streamInfo(){return{comment:nn(this.prelude).comment,directives:this.directives,errors:this.errors,warnings:this.warnings}}*compose(e,t=!1,n=-1){for(let i of e)yield*this.next(i);yield*this.end(t,n)}*next(e){switch(e.type){case"directive":this.directives.add(e.source,(t,n,i)=>{let o=Ze(e);o[0]+=t,this.onError(o,"BAD_DIRECTIVE",n,i)}),this.prelude.push(e.source),this.atDirectives=!0;break;case"document":{let t=sn(this.options,this.directives,e,this.onError);this.atDirectives&&!t.directives.docStart&&this.onError(e,"MISSING_CHAR","Missing directives-end/doc-start indicator line"),this.decorate(t,!1),this.doc&&(yield this.doc),this.doc=t,this.atDirectives=!1;break}case"byte-order-mark":case"space":break;case"comment":case"newline":this.prelude.push(e.source);break;case"error":{let t=e.source?`${e.message}: ${JSON.stringify(e.source)}`:e.message,n=new q(Ze(e),"UNEXPECTED_TOKEN",t);this.atDirectives||!this.doc?this.errors.push(n):this.doc.errors.push(n);break}case"doc-end":{if(!this.doc){let n="Unexpected doc-end without preceding document";this.errors.push(new q(Ze(e),"UNEXPECTED_TOKEN",n));break}this.doc.directives.docEnd=!0;let t=oe(e.end,e.offset+e.source.length,this.doc.options.strict,this.onError);if(this.decorate(this.doc,!0),t.comment){let n=this.doc.comment;this.doc.comment=n?`${n}
${t.comment}`:t.comment}this.doc.range[2]=t.offset;break}default:this.errors.push(new q(Ze(e),"UNEXPECTED_TOKEN",`Unsupported token ${e.type}`))}}*end(e=!1,t=-1){if(this.doc)this.decorate(this.doc,!0),yield this.doc,this.doc=null;else if(e){let n=Object.assign({_directives:this.directives},this.options),i=new ne(void 0,n);this.atDirectives&&this.onError(t,"MISSING_CHAR","Missing directives-end indicator line"),i.range=[0,t,t],this.decorate(i,!1),yield i}}};var ms={};As(ms,{BOM:()=>et,DOCUMENT:()=>tt,FLOW_END:()=>st,SCALAR:()=>Pe,createScalarToken:()=>rn,isCollection:()=>ai,isScalar:()=>li,prettyToken:()=>ci,resolveAsScalar:()=>on,setScalarValue:()=>an,stringify:()=>cn,tokenType:()=>hs,visit:()=>ge});function on(s,e=!0,t){if(s){let n=(i,o,r)=>{let a=typeof i=="number"?i:Array.isArray(i)?i[0]:i.offset;if(t)t(a,o,r);else throw new q([a,a+1],o,r)};switch(s.type){case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":return $t(s,e,n);case"block-scalar":return Mt({options:{strict:e}},s,n)}}return null}function rn(s,e){let{implicitKey:t=!1,indent:n,inFlow:i=!1,offset:o=-1,type:r="PLAIN"}=e,a=le({type:r,value:s},{implicitKey:t,indent:n>0?" ".repeat(n):"",inFlow:i,options:{blockQuote:!0,lineWidth:-1}}),l=e.end??[{type:"newline",offset:-1,indent:n,source:`
`}];switch(a[0]){case"|":case">":{let c=a.indexOf(`
`),d=a.substring(0,c),f=a.substring(c+1)+`
`,u=[{type:"block-scalar-header",offset:o,indent:n,source:d}];return ln(u,l)||u.push({type:"newline",offset:-1,indent:n,source:`
`}),{type:"block-scalar",offset:o,indent:n,props:u,source:f}}case'"':return{type:"double-quoted-scalar",offset:o,indent:n,source:a,end:l};case"'":return{type:"single-quoted-scalar",offset:o,indent:n,source:a,end:l};default:return{type:"scalar",offset:o,indent:n,source:a,end:l}}}function an(s,e,t={}){let{afterKey:n=!1,implicitKey:i=!1,inFlow:o=!1,type:r}=t,a="indent"in s?s.indent:null;if(n&&typeof a=="number"&&(a+=2),!r)switch(s.type){case"single-quoted-scalar":r="QUOTE_SINGLE";break;case"double-quoted-scalar":r="QUOTE_DOUBLE";break;case"block-scalar":{let c=s.props[0];if(c.type!=="block-scalar-header")throw new Error("Invalid block scalar header");r=c.source[0]===">"?"BLOCK_FOLDED":"BLOCK_LITERAL";break}default:r="PLAIN"}let l=le({type:r,value:e},{implicitKey:i||a===null,indent:a!==null&&a>0?" ".repeat(a):"",inFlow:o,options:{blockQuote:!0,lineWidth:-1}});switch(l[0]){case"|":case">":oi(s,l);break;case'"':ps(s,l,"double-quoted-scalar");break;case"'":ps(s,l,"single-quoted-scalar");break;default:ps(s,l,"scalar")}}function oi(s,e){let t=e.indexOf(`
`),n=e.substring(0,t),i=e.substring(t+1)+`
`;if(s.type==="block-scalar"){let o=s.props[0];if(o.type!=="block-scalar-header")throw new Error("Invalid block scalar header");o.source=n,s.source=i}else{let{offset:o}=s,r="indent"in s?s.indent:-1,a=[{type:"block-scalar-header",offset:o,indent:r,source:n}];ln(a,"end"in s?s.end:void 0)||a.push({type:"newline",offset:-1,indent:r,source:`
`});for(let l of Object.keys(s))l!=="type"&&l!=="offset"&&delete s[l];Object.assign(s,{type:"block-scalar",indent:r,props:a,source:i})}}function ln(s,e){if(e)for(let t of e)switch(t.type){case"space":case"comment":s.push(t);break;case"newline":return s.push(t),!0}return!1}function ps(s,e,t){switch(s.type){case"scalar":case"double-quoted-scalar":case"single-quoted-scalar":s.type=t,s.source=e;break;case"block-scalar":{let n=s.props.slice(1),i=e.length;s.props[0].type==="block-scalar-header"&&(i-=s.props[0].source.length);for(let o of n)o.offset+=i;delete s.props,Object.assign(s,{type:t,source:e,end:n});break}case"block-map":case"block-seq":{let i={type:"newline",offset:s.offset+e.length,indent:s.indent,source:`
`};delete s.items,Object.assign(s,{type:t,source:e,end:[i]});break}default:{let n="indent"in s?s.indent:-1,i="end"in s&&Array.isArray(s.end)?s.end.filter(o=>o.type==="space"||o.type==="comment"||o.type==="newline"):[];for(let o of Object.keys(s))o!=="type"&&o!=="offset"&&delete s[o];Object.assign(s,{type:t,indent:n,source:e,end:i})}}}var cn=s=>"type"in s?Bt(s):Dt(s);function Bt(s){switch(s.type){case"block-scalar":{let e="";for(let t of s.props)e+=Bt(t);return e+s.source}case"block-map":case"block-seq":{let e="";for(let t of s.items)e+=Dt(t);return e}case"flow-collection":{let e=s.start.source;for(let t of s.items)e+=Dt(t);for(let t of s.end)e+=t.source;return e}case"document":{let e=Dt(s);if(s.end)for(let t of s.end)e+=t.source;return e}default:{let e=s.source;if("end"in s&&s.end)for(let t of s.end)e+=t.source;return e}}}function Dt({start:s,key:e,sep:t,value:n}){let i="";for(let o of s)i+=o.source;if(e&&(i+=Bt(e)),t)for(let o of t)i+=o.source;return n&&(i+=Bt(n)),i}var ds=Symbol("break visit"),ri=Symbol("skip children"),fn=Symbol("remove item");function ge(s,e){"type"in s&&s.type==="document"&&(s={start:s.start,value:s.value}),un(Object.freeze([]),s,e)}ge.BREAK=ds;ge.SKIP=ri;ge.REMOVE=fn;ge.itemAtPath=(s,e)=>{let t=s;for(let[n,i]of e){let o=t?.[n];if(o&&"items"in o)t=o.items[i];else return}return t};ge.parentCollection=(s,e)=>{let t=ge.itemAtPath(s,e.slice(0,-1)),n=e[e.length-1][0],i=t?.[n];if(i&&"items"in i)return i;throw new Error("Parent collection not found")};function un(s,e,t){let n=t(e,s);if(typeof n=="symbol")return n;for(let i of["key","value"]){let o=e[i];if(o&&"items"in o){for(let r=0;r<o.items.length;++r){let a=un(Object.freeze(s.concat([[i,r]])),o.items[r],t);if(typeof a=="number")r=a-1;else{if(a===ds)return ds;a===fn&&(o.items.splice(r,1),r-=1)}}typeof n=="function"&&i==="key"&&(n=n(e,s))}}return typeof n=="function"?n(e,s):n}var et="\uFEFF",tt="",st="",Pe="",ai=s=>!!s&&"items"in s,li=s=>!!s&&(s.type==="scalar"||s.type==="single-quoted-scalar"||s.type==="double-quoted-scalar"||s.type==="block-scalar");function ci(s){switch(s){case et:return"<BOM>";case tt:return"<DOC>";case st:return"<FLOW_END>";case Pe:return"<SCALAR>";default:return JSON.stringify(s)}}function hs(s){switch(s){case et:return"byte-order-mark";case tt:return"doc-mode";case st:return"flow-error-end";case Pe:return"scalar";case"---":return"doc-start";case"...":return"doc-end";case"":case`
`:case`\r
`:return"newline";case"-":return"seq-item-ind";case"?":return"explicit-key-ind";case":":return"map-value-ind";case"{":return"flow-map-start";case"}":return"flow-map-end";case"[":return"flow-seq-start";case"]":return"flow-seq-end";case",":return"comma"}switch(s[0]){case" ":case"	":return"space";case"#":return"comment";case"%":return"directive-line";case"*":return"alias";case"&":return"anchor";case"!":return"tag";case"'":return"single-quoted-scalar";case'"':return"double-quoted-scalar";case"|":case">":return"block-scalar-header"}return null}function X(s){switch(s){case void 0:case" ":case`
`:case"\r":case"	":return!0;default:return!1}}var pn=new Set("0123456789ABCDEFabcdef"),fi=new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()"),Kt=new Set(",[]{}"),ui=new Set(` ,[]{}
\r	`),gs=s=>!s||ui.has(s),De=class{constructor(){this.atEnd=!1,this.blockScalarIndent=-1,this.blockScalarKeep=!1,this.buffer="",this.flowKey=!1,this.flowLevel=0,this.indentNext=0,this.indentValue=0,this.lineEndPos=null,this.next=null,this.pos=0}*lex(e,t=!1){if(e){if(typeof e!="string")throw TypeError("source is not a string");this.buffer=this.buffer?this.buffer+e:e,this.lineEndPos=null}this.atEnd=!t;let n=this.next??"stream";for(;n&&(t||this.hasChars(1));)n=yield*this.parseNext(n)}atLineEnd(){let e=this.pos,t=this.buffer[e];for(;t===" "||t==="	";)t=this.buffer[++e];return!t||t==="#"||t===`
`?!0:t==="\r"?this.buffer[e+1]===`
`:!1}charAt(e){return this.buffer[this.pos+e]}continueScalar(e){let t=this.buffer[e];if(this.indentNext>0){let n=0;for(;t===" ";)t=this.buffer[++n+e];if(t==="\r"){let i=this.buffer[n+e+1];if(i===`
`||!i&&!this.atEnd)return e+n+1}return t===`
`||n>=this.indentNext||!t&&!this.atEnd?e+n:-1}if(t==="-"||t==="."){let n=this.buffer.substr(e,3);if((n==="---"||n==="...")&&X(this.buffer[e+3]))return-1}return e}getLine(){let e=this.lineEndPos;return(typeof e!="number"||e!==-1&&e<this.pos)&&(e=this.buffer.indexOf(`
`,this.pos),this.lineEndPos=e),e===-1?this.atEnd?this.buffer.substring(this.pos):null:(this.buffer[e-1]==="\r"&&(e-=1),this.buffer.substring(this.pos,e))}hasChars(e){return this.pos+e<=this.buffer.length}setNext(e){return this.buffer=this.buffer.substring(this.pos),this.pos=0,this.lineEndPos=null,this.next=e,null}peek(e){return this.buffer.substr(this.pos,e)}*parseNext(e){switch(e){case"stream":return yield*this.parseStream();case"line-start":return yield*this.parseLineStart();case"block-start":return yield*this.parseBlockStart();case"doc":return yield*this.parseDocument();case"flow":return yield*this.parseFlowCollection();case"quoted-scalar":return yield*this.parseQuotedScalar();case"block-scalar":return yield*this.parseBlockScalar();case"plain-scalar":return yield*this.parsePlainScalar()}}*parseStream(){let e=this.getLine();if(e===null)return this.setNext("stream");if(e[0]===et&&(yield*this.pushCount(1),e=e.substring(1)),e[0]==="%"){let t=e.length,n=e.indexOf("#");for(;n!==-1;){let o=e[n-1];if(o===" "||o==="	"){t=n-1;break}else n=e.indexOf("#",n+1)}for(;;){let o=e[t-1];if(o===" "||o==="	")t-=1;else break}let i=(yield*this.pushCount(t))+(yield*this.pushSpaces(!0));return yield*this.pushCount(e.length-i),this.pushNewline(),"stream"}if(this.atLineEnd()){let t=yield*this.pushSpaces(!0);return yield*this.pushCount(e.length-t),yield*this.pushNewline(),"stream"}return yield tt,yield*this.parseLineStart()}*parseLineStart(){let e=this.charAt(0);if(!e&&!this.atEnd)return this.setNext("line-start");if(e==="-"||e==="."){if(!this.atEnd&&!this.hasChars(4))return this.setNext("line-start");let t=this.peek(3);if((t==="---"||t==="...")&&X(this.charAt(3)))return yield*this.pushCount(3),this.indentValue=0,this.indentNext=0,t==="---"?"doc":"stream"}return this.indentValue=yield*this.pushSpaces(!1),this.indentNext>this.indentValue&&!X(this.charAt(1))&&(this.indentNext=this.indentValue),yield*this.parseBlockStart()}*parseBlockStart(){let[e,t]=this.peek(2);if(!t&&!this.atEnd)return this.setNext("block-start");if((e==="-"||e==="?"||e===":")&&X(t)){let n=(yield*this.pushCount(1))+(yield*this.pushSpaces(!0));return this.indentNext=this.indentValue+1,this.indentValue+=n,yield*this.parseBlockStart()}return"doc"}*parseDocument(){yield*this.pushSpaces(!0);let e=this.getLine();if(e===null)return this.setNext("doc");let t=yield*this.pushIndicators();switch(e[t]){case"#":yield*this.pushCount(e.length-t);case void 0:return yield*this.pushNewline(),yield*this.parseLineStart();case"{":case"[":return yield*this.pushCount(1),this.flowKey=!1,this.flowLevel=1,"flow";case"}":case"]":return yield*this.pushCount(1),"doc";case"*":return yield*this.pushUntil(gs),"doc";case'"':case"'":return yield*this.parseQuotedScalar();case"|":case">":return t+=yield*this.parseBlockScalarHeader(),t+=yield*this.pushSpaces(!0),yield*this.pushCount(e.length-t),yield*this.pushNewline(),yield*this.parseBlockScalar();default:return yield*this.parsePlainScalar()}}*parseFlowCollection(){let e,t,n=-1;do e=yield*this.pushNewline(),e>0?(t=yield*this.pushSpaces(!1),this.indentValue=n=t):t=0,t+=yield*this.pushSpaces(!0);while(e+t>0);let i=this.getLine();if(i===null)return this.setNext("flow");if((n!==-1&&n<this.indentNext&&i[0]!=="#"||n===0&&(i.startsWith("---")||i.startsWith("..."))&&X(i[3]))&&!(n===this.indentNext-1&&this.flowLevel===1&&(i[0]==="]"||i[0]==="}")))return this.flowLevel=0,yield st,yield*this.parseLineStart();let o=0;for(;i[o]===",";)o+=yield*this.pushCount(1),o+=yield*this.pushSpaces(!0),this.flowKey=!1;switch(o+=yield*this.pushIndicators(),i[o]){case void 0:return"flow";case"#":return yield*this.pushCount(i.length-o),"flow";case"{":case"[":return yield*this.pushCount(1),this.flowKey=!1,this.flowLevel+=1,"flow";case"}":case"]":return yield*this.pushCount(1),this.flowKey=!0,this.flowLevel-=1,this.flowLevel?"flow":"doc";case"*":return yield*this.pushUntil(gs),"flow";case'"':case"'":return this.flowKey=!0,yield*this.parseQuotedScalar();case":":{let r=this.charAt(1);if(this.flowKey||X(r)||r===",")return this.flowKey=!1,yield*this.pushCount(1),yield*this.pushSpaces(!0),"flow"}default:return this.flowKey=!1,yield*this.parsePlainScalar()}}*parseQuotedScalar(){let e=this.charAt(0),t=this.buffer.indexOf(e,this.pos+1);if(e==="'")for(;t!==-1&&this.buffer[t+1]==="'";)t=this.buffer.indexOf("'",t+2);else for(;t!==-1;){let o=0;for(;this.buffer[t-1-o]==="\\";)o+=1;if(o%2===0)break;t=this.buffer.indexOf('"',t+1)}let n=this.buffer.substring(0,t),i=n.indexOf(`
`,this.pos);if(i!==-1){for(;i!==-1;){let o=this.continueScalar(i+1);if(o===-1)break;i=n.indexOf(`
`,o)}i!==-1&&(t=i-(n[i-1]==="\r"?2:1))}if(t===-1){if(!this.atEnd)return this.setNext("quoted-scalar");t=this.buffer.length}return yield*this.pushToIndex(t+1,!1),this.flowLevel?"flow":"doc"}*parseBlockScalarHeader(){this.blockScalarIndent=-1,this.blockScalarKeep=!1;let e=this.pos;for(;;){let t=this.buffer[++e];if(t==="+")this.blockScalarKeep=!0;else if(t>"0"&&t<="9")this.blockScalarIndent=Number(t)-1;else if(t!=="-")break}return yield*this.pushUntil(t=>X(t)||t==="#")}*parseBlockScalar(){let e=this.pos-1,t=0,n;e:for(let o=this.pos;n=this.buffer[o];++o)switch(n){case" ":t+=1;break;case`
`:e=o,t=0;break;case"\r":{let r=this.buffer[o+1];if(!r&&!this.atEnd)return this.setNext("block-scalar");if(r===`
`)break}default:break e}if(!n&&!this.atEnd)return this.setNext("block-scalar");if(t>=this.indentNext){this.blockScalarIndent===-1?this.indentNext=t:this.indentNext=this.blockScalarIndent+(this.indentNext===0?1:this.indentNext);do{let o=this.continueScalar(e+1);if(o===-1)break;e=this.buffer.indexOf(`
`,o)}while(e!==-1);if(e===-1){if(!this.atEnd)return this.setNext("block-scalar");e=this.buffer.length}}let i=e+1;for(n=this.buffer[i];n===" ";)n=this.buffer[++i];if(n==="	"){for(;n==="	"||n===" "||n==="\r"||n===`
`;)n=this.buffer[++i];e=i-1}else if(!this.blockScalarKeep)do{let o=e-1,r=this.buffer[o];r==="\r"&&(r=this.buffer[--o]);let a=o;for(;r===" ";)r=this.buffer[--o];if(r===`
`&&o>=this.pos&&o+1+t>a)e=o;else break}while(!0);return yield Pe,yield*this.pushToIndex(e+1,!0),yield*this.parseLineStart()}*parsePlainScalar(){let e=this.flowLevel>0,t=this.pos-1,n=this.pos-1,i;for(;i=this.buffer[++n];)if(i===":"){let o=this.buffer[n+1];if(X(o)||e&&Kt.has(o))break;t=n}else if(X(i)){let o=this.buffer[n+1];if(i==="\r"&&(o===`
`?(n+=1,i=`
`,o=this.buffer[n+1]):t=n),o==="#"||e&&Kt.has(o))break;if(i===`
`){let r=this.continueScalar(n+1);if(r===-1)break;n=Math.max(n,r-2)}}else{if(e&&Kt.has(i))break;t=n}return!i&&!this.atEnd?this.setNext("plain-scalar"):(yield Pe,yield*this.pushToIndex(t+1,!0),e?"flow":"doc")}*pushCount(e){return e>0?(yield this.buffer.substr(this.pos,e),this.pos+=e,e):0}*pushToIndex(e,t){let n=this.buffer.slice(this.pos,e);return n?(yield n,this.pos+=n.length,n.length):(t&&(yield""),0)}*pushIndicators(){switch(this.charAt(0)){case"!":return(yield*this.pushTag())+(yield*this.pushSpaces(!0))+(yield*this.pushIndicators());case"&":return(yield*this.pushUntil(gs))+(yield*this.pushSpaces(!0))+(yield*this.pushIndicators());case"-":case"?":case":":{let e=this.flowLevel>0,t=this.charAt(1);if(X(t)||e&&Kt.has(t))return e?this.flowKey&&(this.flowKey=!1):this.indentNext=this.indentValue+1,(yield*this.pushCount(1))+(yield*this.pushSpaces(!0))+(yield*this.pushIndicators())}}return 0}*pushTag(){if(this.charAt(1)==="<"){let e=this.pos+2,t=this.buffer[e];for(;!X(t)&&t!==">";)t=this.buffer[++e];return yield*this.pushToIndex(t===">"?e+1:e,!1)}else{let e=this.pos+1,t=this.buffer[e];for(;t;)if(fi.has(t))t=this.buffer[++e];else if(t==="%"&&pn.has(this.buffer[e+1])&&pn.has(this.buffer[e+2]))t=this.buffer[e+=3];else break;return yield*this.pushToIndex(e,!1)}}*pushNewline(){let e=this.buffer[this.pos];return e===`
`?yield*this.pushCount(1):e==="\r"&&this.charAt(1)===`
`?yield*this.pushCount(2):0}*pushSpaces(e){let t=this.pos-1,n;do n=this.buffer[++t];while(n===" "||e&&n==="	");let i=t-this.pos;return i>0&&(yield this.buffer.substr(this.pos,i),this.pos=t),i}*pushUntil(e){let t=this.pos,n=this.buffer[t];for(;!e(n);)n=this.buffer[++t];return yield*this.pushToIndex(t,!1)}};var Be=class{constructor(){this.lineStarts=[],this.addNewLine=e=>this.lineStarts.push(e),this.linePos=e=>{let t=0,n=this.lineStarts.length;for(;t<n;){let o=t+n>>1;this.lineStarts[o]<e?t=o+1:n=o}if(this.lineStarts[t]===e)return{line:t+1,col:1};if(t===0)return{line:0,col:e};let i=this.lineStarts[t-1];return{line:t,col:e-i+1}}}};function ye(s,e){for(let t=0;t<s.length;++t)if(s[t].type===e)return!0;return!1}function dn(s){for(let e=0;e<s.length;++e)switch(s[e].type){case"space":case"comment":case"newline":break;default:return e}return-1}function mn(s){switch(s?.type){case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":case"flow-collection":return!0;default:return!1}}function jt(s){switch(s.type){case"document":return s.start;case"block-map":{let e=s.items[s.items.length-1];return e.sep??e.start}case"block-seq":return s.items[s.items.length-1].start;default:return[]}}function Ke(s){if(s.length===0)return[];let e=s.length;e:for(;--e>=0;)switch(s[e].type){case"doc-start":case"explicit-key-ind":case"map-value-ind":case"seq-item-ind":case"newline":break e}for(;s[++e]?.type==="space";);return s.splice(e,s.length)}function hn(s){if(s.start.type==="flow-seq-start")for(let e of s.items)e.sep&&!e.value&&!ye(e.start,"explicit-key-ind")&&!ye(e.sep,"map-value-ind")&&(e.key&&(e.value=e.key),delete e.key,mn(e.value)?e.value.end?Array.prototype.push.apply(e.value.end,e.sep):e.value.end=e.sep:Array.prototype.push.apply(e.start,e.sep),delete e.sep)}var Se=class{constructor(e){this.atNewLine=!0,this.atScalar=!1,this.indent=0,this.offset=0,this.onKeyLine=!1,this.stack=[],this.source="",this.type="",this.lexer=new De,this.onNewLine=e}*parse(e,t=!1){this.onNewLine&&this.offset===0&&this.onNewLine(0);for(let n of this.lexer.lex(e,t))yield*this.next(n);t||(yield*this.end())}*next(e){if(this.source=e,this.atScalar){this.atScalar=!1,yield*this.step(),this.offset+=e.length;return}let t=hs(e);if(t)if(t==="scalar")this.atNewLine=!1,this.atScalar=!0,this.type="scalar";else{switch(this.type=t,yield*this.step(),t){case"newline":this.atNewLine=!0,this.indent=0,this.onNewLine&&this.onNewLine(this.offset+e.length);break;case"space":this.atNewLine&&e[0]===" "&&(this.indent+=e.length);break;case"explicit-key-ind":case"map-value-ind":case"seq-item-ind":this.atNewLine&&(this.indent+=e.length);break;case"doc-mode":case"flow-error-end":return;default:this.atNewLine=!1}this.offset+=e.length}else{let n=`Not a YAML token: ${e}`;yield*this.pop({type:"error",offset:this.offset,message:n,source:e}),this.offset+=e.length}}*end(){for(;this.stack.length>0;)yield*this.pop()}get sourceToken(){return{type:this.type,offset:this.offset,indent:this.indent,source:this.source}}*step(){let e=this.peek(1);if(this.type==="doc-end"&&(!e||e.type!=="doc-end")){for(;this.stack.length>0;)yield*this.pop();this.stack.push({type:"doc-end",offset:this.offset,source:this.source});return}if(!e)return yield*this.stream();switch(e.type){case"document":return yield*this.document(e);case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":return yield*this.scalar(e);case"block-scalar":return yield*this.blockScalar(e);case"block-map":return yield*this.blockMap(e);case"block-seq":return yield*this.blockSequence(e);case"flow-collection":return yield*this.flowCollection(e);case"doc-end":return yield*this.documentEnd(e)}yield*this.pop()}peek(e){return this.stack[this.stack.length-e]}*pop(e){let t=e??this.stack.pop();if(!t)yield{type:"error",offset:this.offset,source:"",message:"Tried to pop an empty stack"};else if(this.stack.length===0)yield t;else{let n=this.peek(1);switch(t.type==="block-scalar"?t.indent="indent"in n?n.indent:0:t.type==="flow-collection"&&n.type==="document"&&(t.indent=0),t.type==="flow-collection"&&hn(t),n.type){case"document":n.value=t;break;case"block-scalar":n.props.push(t);break;case"block-map":{let i=n.items[n.items.length-1];if(i.value){n.items.push({start:[],key:t,sep:[]}),this.onKeyLine=!0;return}else if(i.sep)i.value=t;else{Object.assign(i,{key:t,sep:[]}),this.onKeyLine=!i.explicitKey;return}break}case"block-seq":{let i=n.items[n.items.length-1];i.value?n.items.push({start:[],value:t}):i.value=t;break}case"flow-collection":{let i=n.items[n.items.length-1];!i||i.value?n.items.push({start:[],key:t,sep:[]}):i.sep?i.value=t:Object.assign(i,{key:t,sep:[]});return}default:yield*this.pop(),yield*this.pop(t)}if((n.type==="document"||n.type==="block-map"||n.type==="block-seq")&&(t.type==="block-map"||t.type==="block-seq")){let i=t.items[t.items.length-1];i&&!i.sep&&!i.value&&i.start.length>0&&dn(i.start)===-1&&(t.indent===0||i.start.every(o=>o.type!=="comment"||o.indent<t.indent))&&(n.type==="document"?n.end=i.start:n.items.push({start:i.start}),t.items.splice(-1,1))}}}*stream(){switch(this.type){case"directive-line":yield{type:"directive",offset:this.offset,source:this.source};return;case"byte-order-mark":case"space":case"comment":case"newline":yield this.sourceToken;return;case"doc-mode":case"doc-start":{let e={type:"document",offset:this.offset,start:[]};this.type==="doc-start"&&e.start.push(this.sourceToken),this.stack.push(e);return}}yield{type:"error",offset:this.offset,message:`Unexpected ${this.type} token in YAML stream`,source:this.source}}*document(e){if(e.value)return yield*this.lineEnd(e);switch(this.type){case"doc-start":{dn(e.start)!==-1?(yield*this.pop(),yield*this.step()):e.start.push(this.sourceToken);return}case"anchor":case"tag":case"space":case"comment":case"newline":e.start.push(this.sourceToken);return}let t=this.startBlockValue(e);t?this.stack.push(t):yield{type:"error",offset:this.offset,message:`Unexpected ${this.type} token in YAML document`,source:this.source}}*scalar(e){if(this.type==="map-value-ind"){let t=jt(this.peek(2)),n=Ke(t),i;e.end?(i=e.end,i.push(this.sourceToken),delete e.end):i=[this.sourceToken];let o={type:"block-map",offset:e.offset,indent:e.indent,items:[{start:n,key:e,sep:i}]};this.onKeyLine=!0,this.stack[this.stack.length-1]=o}else yield*this.lineEnd(e)}*blockScalar(e){switch(this.type){case"space":case"comment":case"newline":e.props.push(this.sourceToken);return;case"scalar":if(e.source=this.source,this.atNewLine=!0,this.indent=0,this.onNewLine){let t=this.source.indexOf(`
`)+1;for(;t!==0;)this.onNewLine(this.offset+t),t=this.source.indexOf(`
`,t)+1}yield*this.pop();break;default:yield*this.pop(),yield*this.step()}}*blockMap(e){let t=e.items[e.items.length-1];switch(this.type){case"newline":if(this.onKeyLine=!1,t.value){let n="end"in t.value?t.value.end:void 0;(Array.isArray(n)?n[n.length-1]:void 0)?.type==="comment"?n?.push(this.sourceToken):e.items.push({start:[this.sourceToken]})}else t.sep?t.sep.push(this.sourceToken):t.start.push(this.sourceToken);return;case"space":case"comment":if(t.value)e.items.push({start:[this.sourceToken]});else if(t.sep)t.sep.push(this.sourceToken);else{if(this.atIndentedComment(t.start,e.indent)){let i=e.items[e.items.length-2]?.value?.end;if(Array.isArray(i)){Array.prototype.push.apply(i,t.start),i.push(this.sourceToken),e.items.pop();return}}t.start.push(this.sourceToken)}return}if(this.indent>=e.indent){let n=!this.onKeyLine&&this.indent===e.indent,i=n&&(t.sep||t.explicitKey)&&this.type!=="seq-item-ind",o=[];if(i&&t.sep&&!t.value){let r=[];for(let a=0;a<t.sep.length;++a){let l=t.sep[a];switch(l.type){case"newline":r.push(a);break;case"space":break;case"comment":l.indent>e.indent&&(r.length=0);break;default:r.length=0}}r.length>=2&&(o=t.sep.splice(r[1]))}switch(this.type){case"anchor":case"tag":i||t.value?(o.push(this.sourceToken),e.items.push({start:o}),this.onKeyLine=!0):t.sep?t.sep.push(this.sourceToken):t.start.push(this.sourceToken);return;case"explicit-key-ind":!t.sep&&!t.explicitKey?(t.start.push(this.sourceToken),t.explicitKey=!0):i||t.value?(o.push(this.sourceToken),e.items.push({start:o,explicitKey:!0})):this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:[this.sourceToken],explicitKey:!0}]}),this.onKeyLine=!0;return;case"map-value-ind":if(t.explicitKey)if(t.sep)if(t.value)e.items.push({start:[],key:null,sep:[this.sourceToken]});else if(ye(t.sep,"map-value-ind"))this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:o,key:null,sep:[this.sourceToken]}]});else if(mn(t.key)&&!ye(t.sep,"newline")){let r=Ke(t.start),a=t.key,l=t.sep;l.push(this.sourceToken),delete t.key,delete t.sep,this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:r,key:a,sep:l}]})}else o.length>0?t.sep=t.sep.concat(o,this.sourceToken):t.sep.push(this.sourceToken);else if(ye(t.start,"newline"))Object.assign(t,{key:null,sep:[this.sourceToken]});else{let r=Ke(t.start);this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:r,key:null,sep:[this.sourceToken]}]})}else t.sep?t.value||i?e.items.push({start:o,key:null,sep:[this.sourceToken]}):ye(t.sep,"map-value-ind")?this.stack.push({type:"block-map",offset:this.offset,indent:this.indent,items:[{start:[],key:null,sep:[this.sourceToken]}]}):t.sep.push(this.sourceToken):Object.assign(t,{key:null,sep:[this.sourceToken]});this.onKeyLine=!0;return;case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":{let r=this.flowScalar(this.type);i||t.value?(e.items.push({start:o,key:r,sep:[]}),this.onKeyLine=!0):t.sep?this.stack.push(r):(Object.assign(t,{key:r,sep:[]}),this.onKeyLine=!0);return}default:{let r=this.startBlockValue(e);if(r){if(r.type==="block-seq"){if(!t.explicitKey&&t.sep&&!ye(t.sep,"newline")){yield*this.pop({type:"error",offset:this.offset,message:"Unexpected block-seq-ind on same line with key",source:this.source});return}}else n&&e.items.push({start:o});this.stack.push(r);return}}}}yield*this.pop(),yield*this.step()}*blockSequence(e){let t=e.items[e.items.length-1];switch(this.type){case"newline":if(t.value){let n="end"in t.value?t.value.end:void 0;(Array.isArray(n)?n[n.length-1]:void 0)?.type==="comment"?n?.push(this.sourceToken):e.items.push({start:[this.sourceToken]})}else t.start.push(this.sourceToken);return;case"space":case"comment":if(t.value)e.items.push({start:[this.sourceToken]});else{if(this.atIndentedComment(t.start,e.indent)){let i=e.items[e.items.length-2]?.value?.end;if(Array.isArray(i)){Array.prototype.push.apply(i,t.start),i.push(this.sourceToken),e.items.pop();return}}t.start.push(this.sourceToken)}return;case"anchor":case"tag":if(t.value||this.indent<=e.indent)break;t.start.push(this.sourceToken);return;case"seq-item-ind":if(this.indent!==e.indent)break;t.value||ye(t.start,"seq-item-ind")?e.items.push({start:[this.sourceToken]}):t.start.push(this.sourceToken);return}if(this.indent>e.indent){let n=this.startBlockValue(e);if(n){this.stack.push(n);return}}yield*this.pop(),yield*this.step()}*flowCollection(e){let t=e.items[e.items.length-1];if(this.type==="flow-error-end"){let n;do yield*this.pop(),n=this.peek(1);while(n&&n.type==="flow-collection")}else if(e.end.length===0){switch(this.type){case"comma":case"explicit-key-ind":!t||t.sep?e.items.push({start:[this.sourceToken]}):t.start.push(this.sourceToken);return;case"map-value-ind":!t||t.value?e.items.push({start:[],key:null,sep:[this.sourceToken]}):t.sep?t.sep.push(this.sourceToken):Object.assign(t,{key:null,sep:[this.sourceToken]});return;case"space":case"comment":case"newline":case"anchor":case"tag":!t||t.value?e.items.push({start:[this.sourceToken]}):t.sep?t.sep.push(this.sourceToken):t.start.push(this.sourceToken);return;case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":{let i=this.flowScalar(this.type);!t||t.value?e.items.push({start:[],key:i,sep:[]}):t.sep?this.stack.push(i):Object.assign(t,{key:i,sep:[]});return}case"flow-map-end":case"flow-seq-end":e.end.push(this.sourceToken);return}let n=this.startBlockValue(e);n?this.stack.push(n):(yield*this.pop(),yield*this.step())}else{let n=this.peek(2);if(n.type==="block-map"&&(this.type==="map-value-ind"&&n.indent===e.indent||this.type==="newline"&&!n.items[n.items.length-1].sep))yield*this.pop(),yield*this.step();else if(this.type==="map-value-ind"&&n.type!=="flow-collection"){let i=jt(n),o=Ke(i);hn(e);let r=e.end.splice(1,e.end.length);r.push(this.sourceToken);let a={type:"block-map",offset:e.offset,indent:e.indent,items:[{start:o,key:e,sep:r}]};this.onKeyLine=!0,this.stack[this.stack.length-1]=a}else yield*this.lineEnd(e)}}flowScalar(e){if(this.onNewLine){let t=this.source.indexOf(`
`)+1;for(;t!==0;)this.onNewLine(this.offset+t),t=this.source.indexOf(`
`,t)+1}return{type:e,offset:this.offset,indent:this.indent,source:this.source}}startBlockValue(e){switch(this.type){case"alias":case"scalar":case"single-quoted-scalar":case"double-quoted-scalar":return this.flowScalar(this.type);case"block-scalar-header":return{type:"block-scalar",offset:this.offset,indent:this.indent,props:[this.sourceToken],source:""};case"flow-map-start":case"flow-seq-start":return{type:"flow-collection",offset:this.offset,indent:this.indent,start:this.sourceToken,items:[],end:[]};case"seq-item-ind":return{type:"block-seq",offset:this.offset,indent:this.indent,items:[{start:[this.sourceToken]}]};case"explicit-key-ind":{this.onKeyLine=!0;let t=jt(e),n=Ke(t);return n.push(this.sourceToken),{type:"block-map",offset:this.offset,indent:this.indent,items:[{start:n,explicitKey:!0}]}}case"map-value-ind":{this.onKeyLine=!0;let t=jt(e),n=Ke(t);return{type:"block-map",offset:this.offset,indent:this.indent,items:[{start:n,key:null,sep:[this.sourceToken]}]}}}return null}atIndentedComment(e,t){return this.type!=="comment"||this.indent<=t?!1:e.every(n=>n.type==="newline"||n.type==="space")}*documentEnd(e){this.type!=="doc-mode"&&(e.end?e.end.push(this.sourceToken):e.end=[this.sourceToken],this.type==="newline"&&(yield*this.pop()))}*lineEnd(e){switch(this.type){case"comma":case"doc-start":case"doc-end":case"flow-seq-end":case"flow-map-end":case"map-value-ind":yield*this.pop(),yield*this.step();break;case"newline":this.onKeyLine=!1;case"space":case"comment":default:e.end?e.end.push(this.sourceToken):e.end=[this.sourceToken],this.type==="newline"&&(yield*this.pop())}}};function gn(s){let e=s.prettyErrors!==!1;return{lineCounter:s.lineCounter||e&&new Be||null,prettyErrors:e}}function yn(s,e={}){let{lineCounter:t,prettyErrors:n}=gn(e),i=new Se(t?.addNewLine),o=new we(e),r=Array.from(o.compose(i.parse(s)));if(n&&t)for(let a of r)a.errors.forEach(Qe(s,t)),a.warnings.forEach(Qe(s,t));return r.length>0?r:Object.assign([],{empty:!0},o.streamInfo())}function ys(s,e={}){let{lineCounter:t,prettyErrors:n}=gn(e),i=new Se(t?.addNewLine),o=new we(e),r=null;for(let a of o.compose(i.parse(s),!0,s.length))if(!r)r=a;else if(r.options.logLevel!=="silent"){r.errors.push(new q(a.range.slice(0,2),"MULTIPLE_DOCS","Source contains multiple documents; please use YAML.parseAllDocuments()"));break}return n&&t&&(r.errors.forEach(Qe(s,t)),r.warnings.forEach(Qe(s,t))),r}function bn(s,e,t){let n;typeof e=="function"?n=e:t===void 0&&e&&typeof e=="object"&&(t=e);let i=ys(s,t);if(!i)return null;if(i.warnings.forEach(o=>ht(i.options.logLevel,o)),i.errors.length>0){if(i.options.logLevel!=="silent")throw i.errors[0];i.errors=[]}return i.toJS(Object.assign({reviver:n},t))}function wn(s,e,t){let n=null;if(typeof e=="function"||Array.isArray(e)?n=e:t===void 0&&e&&(t=e),typeof t=="string"&&(t=t.length),typeof t=="number"){let i=Math.round(t);t=i<1?void 0:i>8?{indent:8}:{indent:i}}if(s===void 0){let{keepUndefined:i}=t??e??{};if(!i)return}return F(s)&&!n?s.toString(t):new ne(s,n,t).toString(t)}var ws=bs;var Sn="https://t.alcy.cc/ycy",kn="https://sub-stort-nodejs.pages.dev",An="https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/Config/Mihomo_lite.yaml",xn="https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/refs/heads/main/Config/singbox_1.11.X.json",Nn="https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/refs/heads/main/Config/singbox-1.12.X.json",vn="https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/refs/heads/main/Config/singbox-1.12.X.alpha.json",En=pi("6JCMSUNQ5aSHMjAyNTAwMDHlj7c="),On=atob("aHR0cHM6Ly90Lm1lL01hcmlzYV9rcmlzdGk=");function pi(s){let e=atob(s),t=Uint8Array.from(e,n=>n.charCodeAt(0));return new TextDecoder("utf-8").decode(t)}function je(s,e,t){let n=new URLSearchParams({target:t,url:s,emoji:"true",list:"true",new_name:"true"});return`${e}/sub?${n}`}async function J(s,e){e||(e="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3");let t;try{t=await fetch(s,{method:"GET",headers:{"User-Agent":e}})}catch{return!0}let n=Object.fromEntries(t.headers.entries()),i=di(t.headers);i&&(n["content-disposition"]=i);let o=await t.text(),r;try{r=ws.parse(o,{maxAliasCount:-1,merge:!0})}catch{try{r=JSON.parse(o)}catch{r=o}}return{status:t.status,headers:n,data:r}}function Rt(s){let e=[],t="";for(let n of s)n.startsWith("http://")||n.startsWith("https://")?e.push(n):(t&&(t+="|"),t+=n);return t&&e.push(t),e}async function qt(s){return await J(s)}async function Ft(s){if(!s)throw new Error("\u7F3A\u5C11\u89C4\u5219\u6A21\u677F");return await J(s)}function _n(s="",e=""){let t={mihomo:[{label:"\u901A\u7528",options:[{label:"\u9ED8\u8BA4(\u7CBE\u7B80\u7248) (\u4EC5\u56FD\u5185\u5916\u5206\u6D41) (\u4E0EGithub\u540C\u6B65) ",value:"https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/Mihomo_default.yaml"},{label:"\u9ED8\u8BA4(\u7CBE\u7B80\u7248) (\u4EC5\u56FD\u5185\u5916\u5206\u6D41) (\u65E0\u53BB\u5E7F\u544A) (\u4E0EGithub\u540C\u6B65) ",value:"https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/Mihomo_default_NoAds.yaml"},{label:"\u9ED8\u8BA4(mihomo\u5B98\u65B9\u7248) (\u4E0EGithub\u540C\u6B65) ",value:"https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/Mihomo_official.yaml"},{label:"\u9ED8\u8BA4(mihomo\u5B98\u65B9\u7248) (\u65E0\u53BB\u5E7F\u544A) (\u4E0EGithub\u540C\u6B65) ",value:"https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/Mihomo_official_NoAds.yaml"},{label:"\u9ED8\u8BA4(ACL4SSR_Online_Full) (\u4E0EGithub\u540C\u6B65)",value:"https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/Mihomo_ACL4SSR_Online_Full.yaml"},{label:"\u9ED8\u8BA4(ACL4SSR_Online_Full) (\u65E0\u53BB\u5E7F\u544AMihomo_ACL4SSR_Online_Full_NoAds.yaml) (\u4E0EGithub\u540C\u6B65)",value:"https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/Mihomo_ACL4SSR_Online_Full_NoAds.yaml"},{label:"\u9ED8\u8BA4(\u5168\u5206\u7EC4) (\u4E0EGithub\u540C\u6B65) ",value:"https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/Mihomo_default_full.yaml"},{label:"\u9ED8\u8BA4(\u5168\u5206\u7EC4) (\u65E0\u53BB\u5E7F\u544A) (\u4E0EGithub\u540C\u6B65) ",value:"https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/Mihomo_default_full_NoAds.yaml"}]},{label:"Mihomo-Party-ACL4SSR",options:[{label:"ACL4SSR_Online_Full \u5168\u5305\u91CD\u5EA6\u7528\u6237\u4F7F\u7528(\u4E0EGithub\u540C\u6B65)",value:"https://raw.githubusercontent.com/zhuqq2020/Mihomo-Party-ACL4SSR/main/ACL4SSR_Online_Full.yaml"},{label:"ACL4SSR_Online_Full_AdblockPlus \u5168\u5305\u91CD\u5EA6\u7528\u6237\u4F7F\u7528\u66F4\u591A\u53BB\u5E7F\u544A(\u4E0EGithub\u540C\u6B65)",value:"https://raw.githubusercontent.com/zhuqq2020/Mihomo-Party-ACL4SSR/main/ACL4SSR_Online_Full_AdblockPlus.yaml"},{label:"ACL4SSR_Online_Full_Tiktok \u5168\u5305\u91CD\u5EA6\u7528\u6237\u4F7F\u7528\u6296\u97F3\u5168\u91CF(\u4E0EGithub\u540C\u6B65)",value:"https://raw.githubusercontent.com/zhuqq2020/Mihomo-Party-ACL4SSR/main/ACL4SSR_Online_Full_Tiktok.yaml"},{label:"ACL4SSR_Online_Full_WithIcon \u5168\u5305\u91CD\u5EA6\u7528\u6237\u4F7F\u7528(\u4E0EGithub\u540C\u6B65)(\u65E0\u56FE\u6807)",value:"https://raw.githubusercontent.com/zhuqq2020/Mihomo-Party-ACL4SSR/main/ACL4SSR_Online_Full_WithIcon.yaml"},{label:"ACL4SSR_Online_Mini_MultiMode \u4E13\u4E1A\u7248\u81EA\u52A8\u6D4B\u901F\u3001\u6545\u969C\u8F6C\u79FB\u3001\u8D1F\u8F7D\u5747\u8861(\u4E0EGithub\u540C\u6B65)",value:"https://raw.githubusercontent.com/zhuqq2020/Mihomo-Party-ACL4SSR/main/ACL4SSR_Online_Mini_MultiMode.yaml"},{label:"\u6781\u7B80\u5206\u6D41\u89C4\u5219",value:"https://raw.githubusercontent.com/zhuqq2020/Mihomo-Party-ACL4SSR/main/\u6781\u7B80\u5206\u6D41\u89C4\u5219.yaml"}]},{label:"\u7F51\u7EDC\u6536\u96C6",options:[{label:"\u5E03\u4E01\u72D7\u7684\u8BA2\u9605\u8F6C\u6362 (\u4E0EGithub\u540C\u6B65)",value:"https://raw.githubusercontent.com/mihomo-party-org/override-hub/main/yaml/%E5%B8%83%E4%B8%81%E7%8B%97%E7%9A%84%E8%AE%A2%E9%98%85%E8%BD%AC%E6%8D%A2.yaml"}]},{label:"Lanlan13-14",options:[{label:"configfull \u5168\u5206\u7EC4\u7248 (\u4E0EGithub\u540C\u6B65)",value:"https://raw.githubusercontent.com/Lanlan13-14/Rules/main/configfull.yaml"},{label:"configfull_NoAd \u5168\u5206\u7EC4\u7248 (\u4E0EGithub\u540C\u6B65) (\u65E0\u53BB\u5E7F\u544A)",value:"https://raw.githubusercontent.com/Lanlan13-14/Rules/main/configfull_NoAd.yaml"},{label:"configfull_NoAd_lite \u5168\u5206\u7EC4\u7248 (\u4E0EGithub\u540C\u6B65) (\u65E0\u53BB\u5E7F\u544A) (\u7CBE\u7B80\u7248)",value:"https://raw.githubusercontent.com/Lanlan13-14/Rules/main/configfull_NoAd_lite.yaml"},{label:"configfull_lite \u5168\u5206\u7EC4\u7248 (\u4E0EGithub\u540C\u6B65) (\u7CBE\u7B80\u7248)",value:"https://raw.githubusercontent.com/Lanlan13-14/Rules/main/configfull_lite.yaml"}]}],singbox:[{label:"\u901A\u7528",options:[{label:"\u9ED8\u8BA4(\u7CBE\u7B80\u7248) (\u4E0EGithub\u540C\u6B65) ",value:"https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/singbox_default.yaml"},{label:"\u9ED8\u8BA4(mini\u7248) (\u4E0EGithub\u540C\u6B65) ",value:"https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/singbox_default_mini.yaml"},{label:"\u9ED8\u8BA4(\u5168\u5206\u7EC4) (\u4E0EGithub\u540C\u6B65) ",value:"https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/singbox_default_full.yaml"},{label:"DustinWin \u5168\u5206\u7EC4\u7248[ads] (\u4E0EGithub\u540C\u6B65) ",value:"https://raw.githubusercontent.com/Kwisma/cf-worker-mihomo/main/template/singbox_DustinWin_full.yaml"}]}]};return s&&t.mihomo[0].options.unshift({label:"\u81EA\u5B9A\u4E49\u89C4\u5219",value:s}),e&&t.singbox[0].options.unshift({label:"\u81EA\u5B9A\u4E49\u89C4\u5219",value:e}),JSON.stringify(t)}function di(s){let e=s.get("Content-Disposition")||s.get("content-disposition");if(!e)return null;let t=e.match(/filename="?([^"]+)"?/);if(!t)return null;let n=t[1];if(!/[^\x00-\x7F]/.test(n))return e;let o="download.json",r=encodeURIComponent(n);return`attachment; filename="${o}"; filename*=UTF-8''${r}`}async function Ut(){let s=new Set,e=["https://github.com/mnixry/direct-android-ruleset/raw/refs/heads/rules/@Merged/GAME.mutated.yaml","https://github.com/mnixry/direct-android-ruleset/raw/refs/heads/rules/@Merged/APP.mutated.yaml"],t=["\u6D4F\u89C8\u5668"],n=new Set(["com.android.chrome"]);for(let i of e){let o=await fetch(i,{headers:{"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}});if(!o.ok){console.error(`\u274C \u8BF7\u6C42\u5931\u8D25: ${i} - ${o.status} ${o.statusText}`);continue}let r=await o.text();for(let a of r.split(`
`)){let l=a.match(/PROCESS-NAME\s*,\s*([^\s,]+)/);if(l){let c=l[1];!t.some(f=>a.includes(f))&&!n.has(c)&&s.add(c)}}}return[...s]}async function Gt(){let s=["https://raw.githubusercontent.com/Kwisma/clash-rules/release/cncidr.yaml"],e=[];for(let t of s){let n=await fetch(t,{headers:{"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"}});if(!n.ok){console.error(`\u274C \u8BF7\u6C42\u5931\u8D25: ${t} - ${n.status} ${n.statusText}`);continue}let i=await n.text(),o=ws.parse(i,{maxAliasCount:-1,merge:!0});Array.isArray(o.payload)&&e.push(...o.payload)}return e}async function Ln(s){if(!/meta|clash.meta|clash|clashverge|mihomo/i.test(s.userAgent))throw new Error("\u4E0D\u652F\u6301\u7684\u5BA2\u6237\u7AEF");s.urls=Rt(s.urls);let[e,t,n,i,o]=await Promise.all([qt(s.Mihomo_default),Ft(s.rule),hi(s),s.exclude_package?Ut():null,s.exclude_address?Gt():null]);if(!n?.data?.proxies||n?.data?.proxies?.length===0)throw new Error("\u8282\u70B9\u4E3A\u7A7A");return i&&(t.data["exclude-package"]=i),o&&(t.data["route-exclude-address"]=o),t.data.proxies=[...t?.data?.proxies||[],...n?.data?.proxies],t.data["proxy-groups"]=gi(n.data,t.data),t.data["proxy-providers"]=n?.data?.providers,mi(e.data,t.data,s),{status:n.status,headers:n.headers,data:JSON.stringify(e.data,null,4)}}async function hi(s){let e;if(s.urls.length===1){if(e=await J(s.urls[0],s.userAgent),e?.data?.proxies&&Array.isArray(e?.data?.proxies)&&e?.data?.proxies?.length>0)return e.data.proxies.forEach(t=>{s.udp&&(t.udp=!0)}),{status:e.status,headers:e.headers,data:{...e.data,providers:{}}};{let t=je(s.urls[0],s.sub,"clash");if(e=await J(t,s.userAgent),e?.data?.proxies&&Array.isArray(e?.data?.proxies)&&e?.data?.proxies?.length>0)return e.data.proxies.forEach(n=>{s.udp&&(n.udp=!0)}),{status:e.status,headers:e.headers,data:{...e.data,providers:{}}}}}else{let t={proxies:[],providers:{}},n=[];for(let r=0;r<s.urls?.length;r++){let a=await J(s.urls[r],s.userAgent);if(a?.data&&Array.isArray(a?.data?.proxies))a.data.proxies.forEach(l=>{l.name=`${l.name} [${r+1}]`,s.udp&&(l.udp=!0)}),n.push({status:a.status,headers:a.headers}),t.proxies.push(...a.data.proxies);else{let l=je(s.urls[r],s.sub,"clash");a=await J(l,s.userAgent),a?.data?.proxies&&Array.isArray(a?.data?.proxies)&&(a.data.proxies.forEach(c=>{c.name=`${c.name} [${r+1}]`,s.udp&&(c.udp=!0)}),n.push({status:a.status,headers:a.headers}),t.proxies.push(...a.data.proxies))}}let i=Math.floor(Math.random()*n.length),o=n[i];return{status:o.status,headers:o.headers,data:t}}}function mi(s,e,t){s.tun&&(t.exclude_address&&e["route-exclude-address"]&&(s.tun["route-address"]=["0.0.0.0/1","128.0.0.0/1","::/1","8000::/1"],s.tun["route-exclude-address"]=e["route-exclude-address"]||[]),t.exclude_package&&e["exclude-package"]&&(s.tun["exclude-package"]=e["exclude-package"]||[])),s["proxy-providers"]=e["proxy-providers"]||{},s.proxies=e.proxies||[],s["proxy-groups"]=e["proxy-groups"]||[],s.rules=e.rules||[],s["sub-rules"]=e["sub-rules"]||{},s["rule-providers"]={...s["rule-providers"]||{},...e["rule-providers"]||{}}}function gi(s,e){let t=[],n=e["proxy-groups"].filter(i=>{let o=!1,r=i.filter;if(typeof r=="string"&&r.startsWith("(?i)")&&(r=r.slice(4)),typeof r!="string")return!0;let a=new RegExp(r,"i");for(let l of s.proxies)if(a.test(l.name)){o=!0;break}return o?!0:(t.push(i.name),!1)});return n.forEach(i=>{i.proxies&&(i.proxies=i.proxies.filter(o=>!t.some(r=>r.includes(o))))}),n}async function Cn(s){let e=yi(s);s.urls=Rt(s.urls);let[t,n,i,o,r]=await Promise.all([qt(e),Ft(s.rule),bi(s),s.exclude_package?Ut():null,s.exclude_address?Gt():null]);if(!i?.data?.outbounds||i?.data?.outbounds?.length===0)throw new Error("\u8282\u70B9\u4E3A\u7A7A\uFF0C\u8BF7\u4F7F\u7528\u6709\u6548\u8BA2\u9605");i.data.outbounds=wi(i.data);let a=[];return i.data.outbounds.forEach(l=>{a.push(l.tag)}),n.data.outbounds=Si(n.data.outbounds,a),n.data.outbounds.push(...i.data.outbounds),s.exclude_package&&Ai(t.data,o),s.exclude_address&&xi(t.data,r),s.tailscale&&(t.data.dns.server.push({type:"tailscale",endpoint:"ts-ep",accept_default_resolvers:!0}),t.data.endpoints||(t.data.endpoints=[]),t.data.endpoints.push({type:"tailscale",tag:"ts-ep",auth_key:"",hostname:"singbox-tailscale",udp_timeout:"5m"})),ki(t.data,n.data),{status:i.status,headers:i.headers,data:JSON.stringify(t.data,null,4)}}function yi(s){let e,t=!1,n=s.userAgent.match(/1\.12\.0\-alpha\.(\d{1,2})\b/),i=s.userAgent.match(/1\.12\.0\-beta\.(\d{1,2})\b/),o=s.userAgent.match(/1\.11\.(\d+)/),r=s.userAgent.match(/1\.12\.(\d+)/);if(!/singbox|sing-box|sfa/i.test(s.userAgent))throw new Error("\u4E0D\u652F\u6301\u7684\u5BA2\u6237\u7AEF");if(n&&!t){let a=parseInt(n[1],10);a>=0&&a<=23&&(e=s.singbox_1_12_alpha,t=!0)}if(i&&!t){let a=parseInt(i[1],10);a>=0&&a<=9&&(e=s.singbox_1_11,t=!0)}if(o&&!t&&(e=s.singbox_1_11,t=!0),r&&!t&&(e=s.singbox_1_12,t=!0),!t)throw new Error(`\u4E0D\u652F\u6301\u7684 Singbox \u7248\u672C\uFF1A${s.userAgent}`);return e}async function bi(s){let e;if(s.urls.length===1){if(e=await J(s.urls[0],s.userAgent),e?.data?.outbounds&&Array.isArray(e?.data?.outbounds)&&e?.data?.outbounds?.length>0)return e.data.outbounds.forEach(t=>{s.udp&&(t.udp_fragment=!0)}),{status:e.status,headers:e.headers,data:e.data};{let t=je(s.urls[0],s.sub,"singbox");if(e=await J(t,s.userAgent),e?.data?.outbounds&&Array.isArray(e?.data?.outbounds)&&e?.data?.outbounds?.length>0)return e.data.outbounds.forEach(n=>{s.udp&&(n.udp_fragment=!0)}),{status:e.status,headers:e.headers,data:e.data}}}else{let t=[],n=[],i;for(let l=0;l<s.urls.length;l++)if(i=await J(s.urls[l],s.userAgent),i?.data&&Array.isArray(i?.data?.outbounds))i.data.outbounds.forEach(c=>{c.tag=`${c.tag} [${l+1}]`,s.udp&&(c.udp_fragment=!0)}),n.push({status:i.status,headers:i.headers}),t.push(i.data.outbounds);else{let c=je(s.urls[l],s.sub,"singbox");i=await J(c,s.userAgent),i?.data?.outbounds&&Array.isArray(i?.data?.outbounds)&&(i.data.outbounds.forEach(d=>{d.tag=`${d.tag} [${l+1}]`,s.udp&&(d.udp_fragment=!0)}),n.push({status:i.status,headers:i.headers}),t.push(i.data.outbounds))}let o=Math.floor(Math.random()*n.length),r=n[o],a={outbounds:t.flat()};return{status:r.status,headers:r.headers,data:a}}}function wi(s){let e=["direct","block","dns","selector","urltest"];if(s&&Array.isArray(s.outbounds))return s.outbounds.filter(n=>!(e.includes(n.type)||n?.server===""||n?.server_port<1||n?.password===""))}function Si(s,e){s.forEach(o=>{let r,a=!1;return o.filter?.forEach(l=>{let c=new RegExp(l.keywords)||"";l.action==="include"?(r=e.filter(d=>c.test(d)),a=!0):l.action==="exclude"?(r=e.filter(d=>!c.test(d)),a=!0):l.action==="all"&&(r=e,a=!0)}),a?o.outbounds=[...o.outbounds,...new Set(r)]:o.outbounds!==null?r=o.outbounds:delete o.outbounds,delete o.filter,o});let t=s.filter(o=>Array.isArray(o.outbounds)&&o.outbounds.length===0).map(o=>o.tag);return s.map(o=>(Array.isArray(o.outbounds)&&(o.outbounds=o.outbounds.filter(r=>!t.includes(r))),o)).filter(o=>!(Array.isArray(o.outbounds)&&o.outbounds.length===0))}function ki(s,e){let t=Array.isArray(s.route.rule_set)?s.route.rule_set:[],n=Array.isArray(e.route.rule_set)?e.route.rule_set:[],i=new Map;for(let o of t)o?.tag&&i.set(o.tag,o);for(let o of n)o?.tag&&i.set(o.tag,o);s.inbounds=e?.inbounds||s.inbounds,s.outbounds=[...Array.isArray(s.outbounds)?s.outbounds:[],...Array.isArray(e?.outbounds)?e.outbounds:[]],s.route.final=e?.route?.final||s.route.final,s.route.rules=[...Array.isArray(s.route.rules)?s.route.rules:[],...Array.isArray(e?.route?.rules)?e.route.rules:[]],s.route.rule_set=Array.from(i.values())}function Ai(s,e){for(let t of s.inbounds)t.type==="tun"&&(Array.isArray(t.exclude_package)||(t.exclude_package=[]),t.exclude_package=Array.from(new Set([...t.exclude_package||[],...e])))}function xi(s,e){for(let t of s.inbounds)t.type==="tun"&&(t.route_address=["0.0.0.0/1","128.0.0.0/1","::/1","8000::/1"],Array.isArray(t.route_exclude_address)||(t.route_exclude_address=[]),t.route_exclude_address=Array.from(new Set([...t.route_exclude_address||[],...e])))}async function Tn(s){return`
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg%20id='Partition-Auto--Streamline-Carbon'%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2016%2016'%20height='16'%20width='16'%3E%3Cdesc%3EPartition%20Auto%20Streamline%20Icon%3A%20https%3A//streamlinehq.com%3C/desc%3E%3Cdefs%3E%3C/defs%3E%3Cpath%20d='M13%209.5c-1.1028%200%20-2%200.8972%20-2%202%200%200.3418%200.0941%200.6587%200.24585%200.94045C10.30775%2013.12675%209.17285%2013.5%208%2013.5%204.9673%2013.5%202.5%2011.0327%202.5%208H1.5c0%203.584%202.9159%206.5%206.5%206.5%201.42275%200%202.79615%20-0.468%203.92165%20-1.3208C12.2334%2013.38015%2012.6023%2013.5%2013%2013.5c1.1028%200%202%20-0.8972%202%20-2s-0.8972%20-2%20-2%20-2Zm0%203c-0.5514%200%20-1%20-0.44875%20-1%20-1s0.4486%20-1%201%20-1%201%200.44875%201%201%20-0.4486%201%20-1%201Z'%20fill='%23000000'%20stroke-width='0.5'/%3E%3Cpath%20d='M8%201.5c-1.42275%200%20-2.79615%200.468%20-3.92165%201.3208C3.7666%202.61985%203.3977%202.5%203%202.5%201.8972%202.5%201%203.3972%201%204.5s0.8972%202%202%202%202%20-0.8972%202%20-2c0%20-0.3418%20-0.0941%20-0.6587%20-0.24585%20-0.94045C5.69225%202.87325%206.82715%202.5%208%202.5c3.0327%200%205.5%202.4673%205.5%205.5h1c0%20-3.584%20-2.9159%20-6.5%20-6.5%20-6.5ZM3%205.5c-0.5514%200%20-1%20-0.44875%20-1%20-1s0.4486%20-1%201%20-1%201%200.44875%201%201%20-0.4486%201%20-1%201Z'%20fill='%23000000'%20stroke-width='0.5'/%3E%3Cpath%20id='_Transparent_Rectangle_'%20d='M0%200h16v16H0Z'%20fill='none'%20stroke-width='0.5'/%3E%3C/svg%3E">
    <title>\u914D\u7F6E\u8F6C\u6362\u5DE5\u5177</title>
    <style>
        :root {
            --primary-color: #4361ee;
            --hover-color: #3b4fd3;
            --bg-color: #f5f6fa;
            --card-bg: #ffffff;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-image: url(${s.IMG});
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            background-color: var(--bg-color);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            padding: 60px 0;
            align-items: center;
        }

        .container {
            position: relative;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            max-width: 600px;
            margin: 0;
            width: 90%;
            height: 90%;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05),
                inset 0 0 0 1px rgba(255, 255, 255, 0.1);
            transition: transform 0.3s ease;
        }

        .container:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1),
                inset 0 0 0 1px rgba(255, 255, 255, 0.2);
        }

        h1 {
            text-align: center;
            color: var(--primary-color);
            margin-bottom: 2rem;
            font-size: 1.8rem;
        }

        .input-group {
            margin-bottom: 1.5rem;
        }

        .link-input {
            flex: 1;
            min-width: 0;
            margin-top: 0;
            padding: 12px;
            border: 2px solid rgba(0, 0, 0, 0.15);
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
        }

        .link-row {
            display: flex;
            align-items: center;
            position: relative;
            margin-bottom: 8px;
            gap: 10px;
        }

        .add-btn {
            flex-shrink: 0;
            width: 40px;
            height: 40px;
            background-color: #f8f9fa;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        .add-btn:hover {
            background-color: #ddd;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #555;
            font-weight: 500;
        }

        input {
            width: 100%;
            padding: 12px;
            border: 2px solid rgba(0, 0, 0, 0.15);
            border-radius: 10px;
            font-size: 1rem;
            transition: all 0.3s ease;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
        }

        input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15),
                inset 0 2px 4px rgba(0, 0, 0, 0.03);
        }

        button {
            width: 100%;
            padding: 12px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 1.5rem;
        }

        button:hover {
            background-color: var(--hover-color);
            transform: translateY(-2px);
        }

        button:active {
            transform: translateY(0);
        }

        #result {
            background-color: #f8f9fa;
            font-family: monospace;
            word-break: break-all;
        }

        .github-corner svg {
            fill: var(--primary-color);
            color: var(--card-bg);
            position: absolute;
            top: 0;
            right: 0;
            border: 0;
            width: 80px;
            height: 80px;
        }

        .github-corner:hover .octo-arm {
            animation: octocat-wave 560ms ease-in-out;
        }

        @keyframes octocat-wave {
            0%, 100% { transform: rotate(0); }
            20%, 60% { transform: rotate(-25deg); }
            40%, 80% { transform: rotate(10deg); }
        }

        .logo-title {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 2rem;
        }

        .beian-info {
            text-align: center;
            font-size: 13px;
        }

        .beian-info a {
            color: var(--primary-color);
            text-decoration: none;
            border-bottom: 1px dashed var(--primary-color);
            padding-bottom: 2px;
        }

        .beian-info a:hover {
            border-bottom-style: solid;
        }

        #qrcode {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
        }
        
        .template-selector {
            position: relative;
            margin-bottom: 1.5rem;
        }
        
        .template-toggle {
            padding: 12px 15px;
            background-color: rgba(67, 97, 238, 0.1);
            font-weight: bold;
            cursor: pointer;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background-color 0.2s;
        }
        
        .template-toggle:hover {
            background-color: rgba(67, 97, 238, 0.2);
        }
        
        .template-toggle:after {
            content: "\u25B6";
            font-size: 12px;
            transition: transform 0.3s;
            margin-left: 8px;
        }
        
        .template-toggle.collapsed:after {
            transform: rotate(90deg);
        }
        
        .template-options {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            z-index: 10;
            background-color: white;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            display: none;
            max-height: 200px;
            overflow-y: auto;
        }
        
        .template-options.show {
            display: block;
        }
        
        .template-option {
            padding: 10px 20px;
            cursor: pointer;
            transition: all 0.2s;
            border-bottom: 1px solid #eee;
        }
        
        .template-option:last-child {
            border-bottom: none;
        }
        
        .template-option:hover {
            background-color: rgba(67, 97, 238, 0.1);
        }
        
        .template-option.selected {
            background-color: rgba(67, 97, 238, 0.2);
            font-weight: bold;
        }

        .config-toggle {
            display: flex;
            justify-content: center;
            margin-bottom: 1.5rem;
            background: rgba(67, 97, 238, 0.1);
            border-radius: 10px;
            padding: 8px;
        }

        .toggle-option {
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
            text-align: center;
            flex: 1;
        }

        .toggle-option.active {
            background-color: #4361ee;
            color: white;
        }

        .toggle-option:not(.active):hover {
            background-color: rgba(67, 97, 238, 0.2);
        }

        .mode-options {
            display: none;
        }

        .mode-options.active {
            display: block;
        }

        .tip-icon {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background-color: #4a60ea;
            color: white;
            font-weight: bold;
            font-size: 12px;
            cursor: pointer;
            user-select: none;
        }

        .tip-wrapper {
            position: relative;
            display: inline-block;
        }

        .tip-panel {
            display: none;
            position: absolute;
            top: 24px;
            left: 0;
            min-width: 260px;
            max-width: 320px;
            max-height: 50vh;
            background: white;
            color: #333;
            font-size: 14px;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 999;
            white-space: normal;
            line-height: 1.6;
            overflow-y: auto;
            overflow-x: hidden;
            word-break: break-word;
        }

        .tip-panel ul {
            margin: 8px 0;
            padding-left: 20px;
            list-style-type: disc;
        }

        .tip-panel li {
            margin-bottom: 6px;
        }

        .tip-panel strong, .tip-panel b {
            font-weight: bold;
            color: #4a60ea;
            display: block;
            margin-top: 10px;
        }

        .tip-wrapper.active .tip-panel {
            display: block;
        }

        .protocol-options {
            display: flex;
            gap: 15px;
            margin-top: 8px;
            flex-wrap: wrap;
        }

        .protocol-checkbox {
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            user-select: none;
        }

        .protocol-checkbox input {
            width: auto;
            margin: 0;
        }

    </style>
    <script src="https://cdn.jsdelivr.net/npm/@keeex/qrcodejs-kx@1.0.2/qrcode.min.js"><\/script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
    <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.5/dist/purify.min.js"><\/script>
</head>

<body>
    <a href="${atob("aHR0cHM6Ly9naXRodWIuY29tL0t3aXNtYS9jZi13b3JrZXItbWlob21v")}" target="_blank" class="github-corner"
        aria-label="View source on Github">
        <svg viewBox="0 0 250 250" aria-hidden="true">
            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
            <path
                d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
            <path
                d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
                fill="currentColor" class="octo-body"></path>
        </svg>
    </a>
    <div class="container">
        <div class="logo-title">
            <h1>\u914D\u7F6E\u8F6C\u6362\u5DE5\u5177</h1>
        </div>
        <div class="config-toggle" id="mode-toggle">
            <!-- \u6A21\u5F0F\u5207\u6362\u6309\u94AE\u5C06\u901A\u8FC7JavaScript\u52A8\u6001\u751F\u6210 -->
        </div>
        
        <div id="mode-containers">
            <!-- \u5404\u6A21\u5F0F\u5BB9\u5668\u5C06\u901A\u8FC7JavaScript\u52A8\u6001\u751F\u6210 -->
        </div>

        <div class="input-group">
            <div style="display: flex; flex-direction: column; align-items: flex-start;">
                <label for="result">\u8BA2\u9605\u5730\u5740\uFF1A</label>
            </div>
            <input type="text" id="result" readonly onclick="copyToClipboard()">
            <label id="qrcode" style="margin: 15px 10px -15px 10px;"></label>
        </div>
        <div class="beian-info" style="text-align: center; font-size: 13px;">
            <a href='${s.beianurl}'>${s.beian}</a>
        </div>
    </div>

    <script>
        // \u914D\u7F6E\u6A21\u5F0F\u5B9A\u4E49
        const MODES = {
            mihomo: {
                name: 'Clash (mihomo)',
                placeholder: '\u8BF7\u8F93\u5165clash\u8BA2\u9605\u5730\u5740url\uFF0C\u652F\u6301\u5404\u79CD\u8BA2\u9605\u6216\u5355\u8282\u70B9\u94FE\u63A5',
                tipText: \`
## mihomo \u4F7F\u7528\u63D0\u793A\uFF1A

- \u652F\u6301\u5404\u79CD\u8BA2\u9605\u6216\u5355\u8282\u70B9\u94FE\u63A5\uFF0C\u81EA\u52A8\u5408\u5E76\u751F\u6210\u914D\u7F6E
- \u4F7F\u7528 sub-store \u540E\u7AEF\u8F6C\u6362
- \u53EF\u9009\u6A21\u677F\u751F\u6210 Clash (mihomo) \u94FE\u63A5
- \u53EF\u590D\u5236\u6216\u626B\u7801\u5BFC\u5165
- \u53BB\u5E7F\u544A\u8FC7\u6EE4
- \u9632\u6B62 DNS \u6CC4\u6F0F(\u5B89\u5168DNS/DoH)
- \u5C4F\u853D WebRTC \u6CC4\u6F0F(\u9632\u6B62\u771F\u5B9EIP\u66B4\u9732)
- \u5185\u7F6E \u5206\u5E94\u4EE3\u7406 \u548C IPCIDR
- \u5173\u95ED\u6240\u6709\u8986\u5199\u529F\u80FD(\u4E0D\u662F\u5173\u95ED\u529F\u80FD\uFF0C\u662F\u5173\u95ED\u8986\u5199)\u4EE5\u786E\u4FDD\u914D\u7F6E\u6B63\u5E38\u751F\u6548

## \u914D\u7F6E\u4FE1\u606F

**userAgent** ${s.userAgent}

**\u8F6C\u6362\u540E\u7AEF** ${s.sub}
                \`,
                protocolOptions: [
                    { value: 'udp', label: '\u542F\u7528 UDP', checked: true },
                    { value: 'ep', label: '\u542F\u7528\u5206\u5E94\u7528\u4EE3\u7406(\u4EC5Android)' },
                    { value: 'ea', label: '\u542F\u7528\u5206IPCIDR\u4EE3\u7406(ios/macOS/windows/linux \u63A8\u8350)' }
                ]
            },
            singbox: {
                name: 'Singbox',
                placeholder: '\u8BF7\u8F93\u5165singbox\u8BA2\u9605\u5730\u5740url\uFF0C\u652F\u6301\u5404\u79CD\u8BA2\u9605\u6216\u5355\u8282\u70B9\u94FE\u63A5',
                tipText: \`
## singbox \u4F7F\u7528\u63D0\u793A\uFF1A

- \u652F\u6301\u5404\u79CD\u8BA2\u9605\u6216\u5355\u8282\u70B9\u94FE\u63A5\uFF0C\u81EA\u52A8\u5408\u5E76\u751F\u6210\u914D\u7F6E
- \u4F7F\u7528 sub-store \u540E\u7AEF\u8F6C\u6362
- \u9002\u7528\u4E8E sing-box \u5BA2\u6237\u7AEF
- \u652F\u6301 1.11.x
- \u652F\u6301 1.12.x
- \u652F\u6301\u626B\u7801\u6216\u94FE\u63A5\u590D\u5236\u5BFC\u5165
- \u9632\u6B62 DNS \u6CC4\u6F0F(\u5B89\u5168DNS/DoH)
- \u5185\u7F6E \u5206\u5E94\u4EE3\u7406 \u548C IPCIDR

## \u914D\u7F6E\u4FE1\u606F

**userAgent** ${s.userAgent}

**\u8F6C\u6362\u540E\u7AEF** ${s.sub}
                \`,
                protocolOptions: [
                    { value: 'udp', label: '\u542F\u7528 UDP \u5206\u7247' },
                    { value: 'ep', label: '\u542F\u7528\u5206\u5E94\u7528\u4EE3\u7406(\u4EC5Android)' },
                    { value: 'ea', label: '\u542F\u7528\u5206IPCIDR\u4EE3\u7406(ios/macOS/windows/linux \u63A8\u8350)' },
                    { value: 'tailscale', label: '\u542F\u7528 tailscale' }
                ]
            }
        };

        // \u5F53\u524D\u6FC0\u6D3B\u7684\u6A21\u5F0F
        let activeMode = 'mihomo';
        
        // \u521D\u59CB\u5316\u5E94\u7528
        document.addEventListener('DOMContentLoaded', function () {
            initModeToggle();
            initModeContainers();
            setActiveMode(activeMode);
            
            // \u521D\u59CB\u5316\u63D0\u793A\u7CFB\u7EDF
            initTipSystem();
            
            // \u521D\u59CB\u5316\u6A21\u677F\u9009\u62E9\u5668
            initAllTemplateSelectors();
        });

        // \u521D\u59CB\u5316\u6A21\u5F0F\u5207\u6362\u6309\u94AE
        function initModeToggle() {
            const modeToggle = document.getElementById('mode-toggle');
            
            for (const [modeId, modeConfig] of Object.entries(MODES)) {
                const option = document.createElement('div');
                option.className = 'toggle-option';
                option.dataset.mode = modeId;
                option.textContent = modeConfig.name;
                
                option.addEventListener('click', function() {
                    setActiveMode(modeId);
                });
                
                modeToggle.appendChild(option);
            }
        }

        // \u521D\u59CB\u5316\u6A21\u5F0F\u5BB9\u5668
        function initModeContainers() {
            const modeContainers = document.getElementById('mode-containers');
            const configs = ${s.configs};
            
            for (const [modeId, modeConfig] of Object.entries(MODES)) {
                const container = document.createElement('div');
                container.id = \`\${modeId}-container\`;
                container.className = 'mode-options';
                
                // \u6A21\u677F\u9009\u62E9\u5668
                const templateSelector = document.createElement('div');
                templateSelector.className = 'template-selector';
                templateSelector.innerHTML = \`
                    <div class="template-toggle collapsed">\u9009\u62E9\u914D\u7F6E\u6A21\u677F(\u672A\u9009\u62E9)</div>
                    <div class="template-options"></div>
                \`;
                container.appendChild(templateSelector);
                
                // \u8F93\u5165\u7EC4
                const inputGroup = document.createElement('div');
                inputGroup.className = 'input-group';
                
                const linkLabel = document.createElement('div');
                linkLabel.style.cssText = 'display: flex; align-items: center; gap: 6px; margin-bottom: 6px;';
                linkLabel.innerHTML = \`
                    <label for="link" style="margin: 0;">\u8BA2\u9605\u94FE\u63A5</label>
                    <div class="tip-wrapper">
                        <span class="tip-icon" data-mode="\${modeId}">!</span>
                        <div class="tip-panel"></div>
                    </div>
                \`;
                inputGroup.appendChild(linkLabel);
                
                const linkContainer = document.createElement('div');
                linkContainer.id = \`link-container-\${modeId}\`;
                linkContainer.innerHTML = \`
                    <div class="link-row">
                        <input type="text" class="link-input" placeholder="\${modeConfig.placeholder}" />
                        <div class="add-btn" onclick="addLinkInput(this, '\${modeId}')">\u2795</div>
                    </div>
                \`;
                inputGroup.appendChild(linkContainer);
                
                // \u534F\u8BAE\u9009\u9879
                const protocolLabel = document.createElement('label');
                protocolLabel.textContent = '\u9644\u52A0\u53C2\u6570\u9009\u9879';
                inputGroup.appendChild(protocolLabel);
                
                const protocolOptions = document.createElement('div');
                protocolOptions.className = 'protocol-options';
                
                modeConfig.protocolOptions.forEach(option => {
                    const label = document.createElement('label');
                    label.className = 'protocol-checkbox';
                    label.innerHTML = \`
                        <input type="checkbox" name="protocol" value="\${option.value}" \${option.checked ? 'checked' : ''}>
                        \${option.label}
                    \`;
                    protocolOptions.appendChild(label);
                });
                
                inputGroup.appendChild(protocolOptions);
                container.appendChild(inputGroup);
                
                // \u751F\u6210\u6309\u94AE
                const generateButton = document.createElement('button');
                generateButton.textContent = \`\u751F\u6210\${modeConfig.name}\u914D\u7F6E\`;
                generateButton.onclick = function() { generateConfig(modeId); };
                container.appendChild(generateButton);
                
                modeContainers.appendChild(container);
            }
        }

        // \u8BBE\u7F6E\u6D3B\u52A8\u6A21\u5F0F
        function setActiveMode(modeId) {
            // \u66F4\u65B0\u5207\u6362\u6309\u94AE\u72B6\u6001
            document.querySelectorAll('.toggle-option').forEach(option => {
                option.classList.toggle('active', option.dataset.mode === modeId);
            });
            
            // \u66F4\u65B0\u6A21\u5F0F\u5BB9\u5668\u663E\u793A\u72B6\u6001
            document.querySelectorAll('.mode-options').forEach(container => {
                container.classList.toggle('active', container.id === \`\${modeId}-container\`);
            });
            
            activeMode = modeId;
        }

        // \u521D\u59CB\u5316\u63D0\u793A\u7CFB\u7EDF
        function initTipSystem() {
            // \u5F39\u7A97\u63D0\u793A
            document.querySelectorAll('.tip-icon').forEach(icon => {
                icon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // \u5173\u95ED\u6240\u6709\u5DF2\u5C55\u5F00
                    document.querySelectorAll('.tip-wrapper').forEach(w => w.classList.remove('active'));
                    
                    const wrapper = icon.closest('.tip-wrapper');
                    wrapper.classList.toggle('active');
                    
                    const panel = wrapper.querySelector('.tip-panel');
                    const mode = icon.dataset.mode;
                    
                    // \u4F7F\u7528 marked \u6E32\u67D3 Markdown \u4E3A HTML
                    const rawMarkdown = MODES[mode].tipText || '\u6682\u65E0\u63D0\u793A\u5185\u5BB9';
                    panel.innerHTML = DOMPurify.sanitize(marked.parse(rawMarkdown));
                });
            });
            
            // \u70B9\u51FB\u9875\u9762\u5176\u4ED6\u5730\u65B9\u5173\u95ED\u63D0\u793A
            document.addEventListener('click', () => {
                document.querySelectorAll('.tip-wrapper').forEach(w => w.classList.remove('active'));
            });
        }

        // \u521D\u59CB\u5316\u6240\u6709\u6A21\u677F\u9009\u62E9\u5668
        function initAllTemplateSelectors() {
            const configs = ${s.configs};
            
            for (const modeId of Object.keys(MODES)) {
                if (configs[modeId]) {
                    initTemplateSelector(modeId, configs[modeId]);
                }
            }
        }

        // \u521D\u59CB\u5316\u6A21\u677F\u9009\u62E9\u5668
        function initTemplateSelector(modeId, configGroups) {
            const selector = document.querySelector(\`#\${modeId}-container .template-selector\`);
            const templateToggle = selector.querySelector('.template-toggle');
            const optionsContainer = selector.querySelector('.template-options');
            
            // \u751F\u6210\u6240\u6709\u6A21\u677F\u9009\u9879
            configGroups.forEach(group => {
                // \u6DFB\u52A0\u5206\u7EC4\u6807\u7B7E
                const groupLabel = document.createElement('div');
                groupLabel.style.padding = '10px 20px';
                groupLabel.style.fontWeight = 'bold';
                groupLabel.style.color = '#555';
                groupLabel.style.backgroundColor = '#f5f5f5';
                groupLabel.textContent = group.label;
                optionsContainer.appendChild(groupLabel);
                
                // \u6DFB\u52A0\u9009\u9879
                group.options.forEach(option => {
                    const optionElement = document.createElement('div');
                    optionElement.className = 'template-option';
                    optionElement.textContent = option.label;
                    optionElement.dataset.value = option.value;
                    optionElement.dataset.group = group.label;
                    
                    optionElement.addEventListener('click', function () {
                        // \u79FB\u9664\u4E4B\u524D\u9009\u4E2D\u7684\u6837\u5F0F
                        selector.querySelectorAll('.template-option.selected').forEach(item => {
                            item.classList.remove('selected');
                        });
                        
                        // \u66F4\u65B0\u663E\u793A\u6587\u672C
                        templateToggle.textContent = \`\${group.label}-\${option.label}\`;
                        
                        // \u6DFB\u52A0\u9009\u4E2D\u6837\u5F0F
                        this.classList.add('selected');
                        
                        // \u70B9\u51FB\u540E\u81EA\u52A8\u6298\u53E0\u9009\u9879\u9762\u677F
                        templateToggle.classList.add('collapsed');
                        optionsContainer.classList.remove('show');
                    });
                    
                    optionsContainer.appendChild(optionElement);
                });
            });
            
            // \u9ED8\u8BA4\u9009\u62E9\u7B2C\u4E00\u4E2A\u9009\u9879
            const firstOption = selector.querySelector('.template-option');
            if (firstOption) {
                firstOption.classList.add('selected');
                const groupLabel = firstOption.dataset.group;
                const optionLabel = firstOption.textContent;
                templateToggle.textContent = \`\u8BF7\u9009\u62E9\u914D\u7F6E\u6A21\u677F(\u9ED8\u8BA4-\${groupLabel})\`;
            }
            
            // \u70B9\u51FB\u5207\u6362\u6309\u94AE\u5C55\u5F00/\u6298\u53E0\u9009\u9879
            templateToggle.addEventListener('click', function () {
                this.classList.toggle('collapsed');
                optionsContainer.classList.toggle('show');
            });
            
            // \u70B9\u51FB\u9875\u9762\u5176\u4ED6\u533A\u57DF\u5173\u95ED\u9009\u9879\u9762\u677F
            document.addEventListener('click', function (event) {
                if (!templateToggle.contains(event.target) && !optionsContainer.contains(event.target)) {
                    templateToggle.classList.add('collapsed');
                    optionsContainer.classList.remove('show');
                }
            });
        }

        // \u6DFB\u52A0\u94FE\u63A5\u8F93\u5165\u6846
        function addLinkInput(button, modeId) {
            const container = document.getElementById(\`link-container-\${modeId}\`);
            const row = document.createElement('div');
            row.className = 'link-row';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'link-input';
            input.placeholder = MODES[modeId].placeholder;
            
            button.style.display = 'none';
            row.appendChild(input);
            container.appendChild(row);
            
            const btn = document.createElement('div');
            btn.className = 'add-btn';
            btn.textContent = '\u2795';
            btn.onclick = function () {
                addLinkInput(btn, modeId);
            };
            
            row.appendChild(btn);
        }

        // \u751F\u6210\u914D\u7F6E
        function generateConfig(modeId) {
            const inputs = document.querySelectorAll(\`#\${modeId}-container .link-input\`);
            const selectedOption = document.querySelector(\`#\${modeId}-container .template-option.selected\`);
            const protocolParams = {};
            
            document.querySelectorAll(\`#\${modeId}-container .protocol-options input[type="checkbox"]\`).forEach(checkbox => {
                protocolParams[checkbox.value] = checkbox.checked;
            });
            
            const subscriptionLinks = Array.from(inputs)
                .map(input => input.value.trim())
                .filter(val => val !== '');
            
            const templateLink = selectedOption ? selectedOption.dataset.value : '';
            
            if (subscriptionLinks.length === 0 && templateLink) {
                alert('\u8BF7\u8F93\u5165\u81F3\u5C11\u4E00\u4E2A\u8BA2\u9605\u94FE\u63A5');
                return;
            }
            
            const allLinks = [];
            subscriptionLinks.forEach(link => {
                allLinks.push(encodeURIComponent(link));
            });
            
            const origin = window.location.origin;
            let urlLink = \`\${origin}/?template=\${encodeURIComponent(templateLink)}&url=\${allLinks.join(',')}&\${modeId}=true\`;
            
            for (const [protocol, enabled] of Object.entries(protocolParams)) {
                if (enabled) {
                    urlLink += \`&\${protocol}=true\`;
                }
            }
            
            updateResult(urlLink);
        }

        // \u590D\u5236\u5230\u526A\u8D34\u677F
        function copyToClipboard() {
            const resultInput = document.getElementById('result');
            if (!resultInput.value) {
                return;
            }
            
            resultInput.select();
            navigator.clipboard.writeText(resultInput.value).then(() => {
                const tooltip = document.createElement('div');
                tooltip.style.position = 'fixed';
                tooltip.style.left = '50%';
                tooltip.style.top = '20px';
                tooltip.style.transform = 'translateX(-50%)';
                tooltip.style.padding = '8px 16px';
                tooltip.style.background = '#4361ee';
                tooltip.style.color = 'white';
                tooltip.style.borderRadius = '4px';
                tooltip.style.zIndex = '1000';
                tooltip.textContent = '\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F';
                
                document.body.appendChild(tooltip);
                
                setTimeout(() => {
                    document.body.removeChild(tooltip);
                }, 2000);
            }).catch(err => {
                alert('\u590D\u5236\u5931\u8D25\uFF0C\u8BF7\u624B\u52A8\u590D\u5236');
            });
        }

        // \u66F4\u65B0\u7ED3\u679C\u548C\u4E8C\u7EF4\u7801
        function updateResult(urlLink) {
            document.getElementById('result').value = urlLink;
            
            // \u751F\u6210\u4E8C\u7EF4\u7801
            const qrcodeDiv = document.getElementById('qrcode');
            qrcodeDiv.innerHTML = '';
            new QRCode(qrcodeDiv, {
                text: urlLink,
                width: 220,
                height: 220,
                colorDark: "#4a60ea",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.L,
                scale: 1
            });
        }
    <\/script>
</body>
</html>`}var cf={async fetch(s,e){let t=new URL(s.url),n={url:t,urls:t.searchParams.getAll("url"),userAgent:s.headers.get("User-Agent"),rule:t.searchParams.get("template"),singbox:t.searchParams.get("singbox")==="true",mihomo:t.searchParams.get("mihomo")==="true",udp:t.searchParams.get("udp")==="true",exclude_package:t.searchParams.get("ep")==="true",exclude_address:t.searchParams.get("ea")==="true",tailscale:t.searchParams.get("tailscale")==="true",IMG:e.IMG||Sn,sub:e.SUB||kn,Mihomo_default:e.MIHOMOTOP||An,singbox_1_11:e.SINGBOX_1_11||xn,singbox_1_12:e.SINGBOX_1_12||Nn,singbox_1_12_alpha:e.SINGBOX_1_12_ALPHA||vn,beian:e.BEIAN||En,beianurl:e.BEIANURL||On,configs:_n(e.MIHOMO,e.SINGBOX)};if(n.urls.length===1&&n.urls[0].includes(",")&&(n.urls=n.urls[0].split(",").map(i=>i.trim())),n.urls.length===0||n.urls[0]==="")return new Response(await Tn(n),{status:200,headers:{"Content-Type":"text/html; charset=utf-8"}});try{let i,o,r;n.singbox?i=await Cn(n):i=await Ln(n);let a=i.headers;return o=new Headers(a),r=i.status,o.set("Content-Type","application/json; charset=utf-8"),o.set("Profile-web-page-url",t.origin),new Response(i.data,{status:r,headers:o})}catch(i){return new Response(i.message,{status:400,headers:{"Content-Type":"application/json; charset=utf-8"}})}}};export{cf as default};
//# sourceMappingURL=_worker.js.map

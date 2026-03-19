/** @type {import('tailwindcss').Config} */

module.exports = {

darkMode: "class",

content: [

"./app/**/*.{js,ts,jsx,tsx,mdx}",
"./pages/**/*.{js,ts,jsx,tsx,mdx}",
"./components/**/*.{js,ts,jsx,tsx,mdx}"

],

theme: {

container:{
center:true,
padding:"1rem",

screens:{
sm:"640px",
md:"768px",
lg:"1024px",
xl:"1280px",
"2xl":"1400px"
}
},

extend:{

//////////////////////////////////////////////////////
// COLORS (NNTV BRAND SYSTEM)
//////////////////////////////////////////////////////

colors:{

nntv:{
purple:"#4b0055",
purpleDark:"#2c0031",
gold:"#ffd700",
goldSoft:"#caa54b",

darkBg:"#0f0f12",
darkCard:"#1e1e22",
darkBorder:"#2f2f35"
}

},

//////////////////////////////////////////////////////
// BORDER RADIUS
//////////////////////////////////////////////////////

borderRadius:{
lg:"12px",
xl:"16px"
},

//////////////////////////////////////////////////////
// BOX SHADOW
//////////////////////////////////////////////////////

boxShadow:{

card:"0 10px 30px rgba(0,0,0,0.08)",

cardHover:"0 16px 40px rgba(0,0,0,0.12)",

soft:"0 4px 12px rgba(0,0,0,0.05)"

},

//////////////////////////////////////////////////////
// FONT SYSTEM
//////////////////////////////////////////////////////

fontFamily:{

heading:["var(--font-heading)","sans-serif"],
body:["var(--font-body)","sans-serif"],
menu:["var(--font-menu)","sans-serif"]

},

//////////////////////////////////////////////////////
// ANIMATION
//////////////////////////////////////////////////////

animation:{

ticker:"tickerMove 25s linear infinite"

},

keyframes:{

tickerMove:{
"0%":{transform:"translateX(100%)"},
"100%":{transform:"translateX(-100%)"}
}

}

}

},

plugins:[]

}
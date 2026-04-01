import type { Investor } from './types.ts';

export const INVESTORS: Investor[] = [
  {id:1,name:"Anupam Mittal",fund:"People Group", city:"Delhi NCR",area:"South Delhi", focus:["Consumer","D2C"], email:"connect@peoplegroup.in", initials:"AM",color:"#3B82F6", lat:28.5494,lng:77.2001,distance:"3.2 km", officeAddress:"B-68 Defence Colony New Delhi"},
  {id:2,name:"Ritesh Malik",fund:"Innov8", city:"Delhi NCR",area:"Hauz Khas", focus:["EdTech","SaaS"], email:"ritesh@innov8.in", initials:"RM",color:"#8B5CF6", lat:28.5535,lng:77.1910,distance:"5.1 km", officeAddress:"Hauz Khas Village New Delhi"},
  {id:3,name:"Rajan Anandan",fund:"Peak XV", city:"Delhi NCR",area:"Connaught Place", focus:["Fintech","AI"], email:"rajan@peakxv.com", initials:"RA",color:"#10B981", lat:28.6315,lng:77.2167,distance:"8.4 km", officeAddress:"Statesman House CP Delhi"},
  {id:4,name:"Sandeep Murthy",fund:"Lightbox VC", city:"Delhi NCR",area:"Aerocity", focus:["Retail","Consumer"], email:"sandeep@lightbox.vc", initials:"SM",color:"#F59E0B", lat:28.5562,lng:77.0890,distance:"12.3 km", officeAddress:"Worldmark 1 Aerocity Delhi"},
  {id:5,name:"Deepak Gupta",fund:"Orios VP", city:"Delhi NCR",area:"Gurugram", focus:["B2B","Logistics"], email:"deepak@oriosvp.com", initials:"DG",color:"#EF4444", lat:28.4595,lng:77.0266,distance:"15.7 km", officeAddress:"DLF Cyber City Gurugram"},
  {id:6,name:"Mukesh Bansal",fund:"Curefit", city:"Mumbai",area:"BKC", focus:["Consumer","Health"], email:"mukesh@curefit.com", initials:"MB",color:"#3B82F6", lat:19.0596,lng:72.8656,distance:"4.2 km", officeAddress:"BKC Bandra East Mumbai"},
  {id:7,name:"Rehan Yar Khan",fund:"Orios VP", city:"Mumbai",area:"Andheri West", focus:["Fintech","SaaS"], email:"rehan@oriosvp.com", initials:"RK",color:"#8B5CF6", lat:19.1197,lng:72.8462,distance:"6.8 km", officeAddress:"Andheri West Mumbai"},
  {id:8,name:"Nandini Mansinghka",fund:"100X VC", city:"Mumbai",area:"Lower Parel", focus:["D2C","Consumer"], email:"nandini@100x.vc", initials:"NM",color:"#10B981", lat:18.9988,lng:72.8302,distance:"9.1 km", officeAddress:"Lower Parel Mumbai"},
  {id:9,name:"Sachin Bansal",fund:"Navi", city:"Bangalore",area:"Koramangala", focus:["Fintech","Consumer"], email:"sachin@navi.com", initials:"SB",color:"#F59E0B", lat:12.9352,lng:77.6245,distance:"3.5 km", officeAddress:"Koramangala 5th Block Bangalore"},
  {id:10,name:"Vani Kola",fund:"Kalaari Capital", city:"Bangalore",area:"Indiranagar", focus:["SaaS","HealthTech"], email:"vani@kalaari.com", initials:"VK",color:"#EF4444", lat:12.9784,lng:77.6408,distance:"5.2 km", officeAddress:"Indiranagar Bangalore"},
  {id:11,name:"Sashi Reddi",fund:"AppLabs", city:"Hyderabad",area:"Hitech City", focus:["SaaS","Enterprise"], email:"sashi@applabs.com", initials:"SR",color:"#3B82F6", lat:17.4474,lng:78.3762,distance:"4.7 km", officeAddress:"Hitech City Hyderabad"},
  {id:12,name:"Anisha Singh",fund:"She Capital", city:"Hyderabad",area:"Banjara Hills", focus:["Consumer","Women"], email:"anisha@shecapital.in", initials:"AS",color:"#8B5CF6", lat:17.4126,lng:78.4439,distance:"6.3 km", officeAddress:"Banjara Hills Road 12 Hyderabad"},
  {id:13,name:"Prashanth Prakash",fund:"Accel India", city:"Bangalore",area:"Koramangala", focus:["SaaS","B2B"], email:"prashanth@accel.com", initials:"PP",color:"#10B981", lat:12.9300,lng:77.6200,distance:"6.1 km", officeAddress:"Accel Office Koramangala Blr"},
  {id:14,name:"Sujith Pai",fund:"Mirae Asset", city:"Mumbai",area:"Powai", focus:["Fintech","Growth"], email:"sujith@miraeasset.com", initials:"SP",color:"#F59E0B", lat:19.1176,lng:72.9060,distance:"11.2 km", officeAddress:"Hiranandani Powai Mumbai"},
  {id:15,name:"Rahul Khanna",fund:"Trifecta Capital", city:"Delhi NCR",area:"Noida", focus:["Debt","Startup Finance"], email:"rahul@trifectacapital.in", initials:"RH",color:"#EF4444", lat:28.5355,lng:77.3910,distance:"18.2 km", officeAddress:"Sector 62 Noida UP"}
];

export const CITIES = ["Delhi NCR", "Mumbai", "Bangalore", "Hyderabad", "Pune", "Chennai"];

export const PPT_THEMES = {
  'Dark': {
    bg:'#0A0F2C', title:'#FFFFFF',
    text:'#E5E7EB', accent:'#3B82F6',
    card:'#111827', subtitle:'#93C5FD'
  },
  'Startup': {
    bg:'#0F172A', title:'#FFFFFF',
    text:'#E2E8F0', accent:'#6366F1',
    card:'#1E1B4B', subtitle:'#C4B5FD'
  },
  'Corporate': {
    bg:'#1E293B', title:'#FFFFFF',
    text:'#CBD5E1', accent:'#0EA5E9',
    card:'#0F172A', subtitle:'#7DD3FC'
  },
  'Light': {
    bg:'#FFFFFF', title:'#111827',
    text:'#374151', accent:'#3B82F6',
    card:'#F8FAFC', subtitle:'#6B7280'
  },
  'Colorful': {
    bg:'#1A0A2E', title:'#FFFFFF',
    text:'#E9D5FF', accent:'#A855F7',
    card:'#2D1B69', subtitle:'#C084FC'
  },
  'Purple': {
    bg:'#1E1B4B', title:'#FFFFFF',
    text:'#E0E7FF', accent:'#818CF8',
    card:'#312E81', subtitle:'#A5B4FC'
  }
};

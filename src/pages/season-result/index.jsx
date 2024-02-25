import { Chart, DataFetch, SelectOptionAsObjectValue } from "@/components";
import Sidebar from "@/components/SideBar";
import { API_ENDPOINTS, consolelog} from "@/configs";
import fake from "@/configs/fakedata";
import { useHttpServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";

export default function Result({league, year}) {
  const {postData}=useHttpServices()

  const [activeTab, setActiveTab]= useState('general')
  const getSeasonData=async()=>{    
    return await postData(API_ENDPOINTS.GET_SEASON_INFO,{
      league, year
    })
  }

  const {isLoading:seasonLoading, data:season_data, error, isError:isSeasonError}= useQuery(
    {
      queryKey:['season-info:',league, year],
      queryFn:()=>getSeasonData(),
      onSettled:(data)=>{
        consolelog({finalData:data})

      },
      retry:false
    }
  )
  const updateData=({season_data,options})=>{
    if(!season_data){
      // do codes
      // carry the first and use to update the options
    }

    consolelog({season_data})
    const csv_files= fake
    // parseCSVFile('./public/your-file.csv')
    // consolelog({csv_files})
    return {csv:{data:csv_files, all_data:csv_files}, body:{}}
  } 
  // const toggleOptions=(season_data)=>{
  //   if(!season_data) return {}
  //   consolelog({season_data})
  //   return season_data
  // } 

  const [options, setOptions]= useState({
    monthFrom:"Beginning",
    monthTo:"Ending", kickOffTime:"any"
  })

  const monthOptions=['Beginning','January', 'February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Ending']
  const {body, csv} = useMemo(() => updateData({season_data,options}), [season_data,options]);
  
  // const {} = useMemo(() => updateData({season_data,options}), [csv]);

  // const data_to_use = useMemo(() => toggleOptions(season_data), [options]);
  
  // consolelog({season_data})
  return (
    <main className="p-2 min-h-screen">
      <Head>
      {/* {league?.toUpperCase() || ''} {year?.toUpperCase() || ''}  */}
      {/* Get the latest insights into the ${league?.toUpperCase()} ${year?.toUpperCase()}} season. */}
        <title>Season: Goals, Cleansheets & Performance Insights</title>
        <meta name="description" content={`Explore match performances, goal, cleansheets and key moments in our comprehensive statistical report.`}/>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div className="flex items-start rounded-[27px] border shadow-lg h-[700px]">
        <Sidebar active={activeTab} onClick={(a)=>setActiveTab(a)}/>
        <section className=" py-2 pr-3  ml-[-3px] w-[100%]">
          <div className="bg-[#F9F9F9] py-5 pl-[30px] pr-5 rounded-r-[27px]">
            <div>
                <h1 className="uppercase text-2xl font-bold mb-[30px]">{year} {league} SEASON STATISTICS</h1>
                <hr />
            </div>
            <div className="grid grid-cols-3 gap-[10px] w-[1000px] mt-6 mb-2">
              <div>
                <SelectOptionAsObjectValue
                  options={monthOptions.slice(0, monthOptions.indexOf(options.monthTo)).map((month)=>({label:month,value:month}))}
                  onChange={(x)=>setOptions({...options, monthFrom:x.value})}
                  label={options.monthFrom || 'Beginning'}
                  value={options.monthFrom || 'Beginning'}
                  leftSibling={
                    <p className="opacity-75 text-gray-500">Month from:</p>
                  }
                />
              </div>
              <div>
              <SelectOptionAsObjectValue
                  options={monthOptions.slice(monthOptions.indexOf(options.monthFrom)+1).map((month)=>({label:month,value:month}))}
                  onChange={(x)=>setOptions({...options, monthTo:x})}
                  label={options.monthTo || 'Ending'}
                  value={options.monthTo || 'Ending'}
                  leftSibling={
                    <p className="opacity-75 text-gray-500">Month To:</p>
                  }
                />
              </div>
              <div>
                <SelectOptionAsObjectValue
                    options={['All', 'Early','Standard', 'Late'].map((kickoff)=>({label:kickoff,value:kickoff.toLowerCase()+' kick-off'}))}
                    onChange={(x)=>setOptions({...options, kickOffTime:x.value})}
                    label={options.kickOffTime.split(' ')[0] || 'any'}
                    value={options.kickOffTime || 'any'}
                    leftSibling={
                      <p className="opacity-75 text-gray-500">Kick-off Time:</p>
                    }
                  />
              </div>
            </div>
            <div className="min-h-[580px] flex items-center flex-col justify-center">
              <DataFetch isLoading={seasonLoading} isError={isSeasonError} 
                isEmpty={false} errorMsg={error?.message}
                emptyComponent={
                  <div className="">
                    <p>Data gotten is empty</p>
                  </div>
                }
                errorComponent={
                  <div className="">
                    <p>Something went wrong</p>
                  </div>
                }
                
                >
                <section>
                  <Chart data={csv.data} tab={activeTab}/>
                </section>
              </DataFetch>
            </div>            
          </div>
        </section>
      </div>
    </main>
  );
}

export const getServerSideProps = async (req) => {
  
  const {league, year}=req.query
  if(!league || !year){
    return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
  }
  return {
    props: {
        league, year
    },
  };
};
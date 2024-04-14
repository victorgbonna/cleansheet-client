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
  const months=['January', 'February', 'March', 'April', 'May', 'June', 'August', 'September', 'October', 'November', 'December']
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
  const [monthOptions,setMonthOptions]=useState(['Beginning','January', 'February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Ending'])
  const [mounted, setMounted]= useState(false)
  const updateData=({season_data,options})=>{
    if(!season_data){
      // do codes
      // carry the first and use to update the options
    }

    consolelog({season_data})
    const csv_files= fake
    const {monthFrom, monthTo, kickOffTime}=options

    consolelog({monthTo})
    let range_of_months=monthOptions
    if(!mounted){
      const starting_month=csv_files[0].match_date.split(' ')[1]
      // const ending_month=csv_files?.find(({game_week})=>game_week===38)?.match_date.split(' ')[1]
      // const ending_month=Math.max(...csv_files.filter(game=>parseInt(game.game_week)).map(game => game.game_week))
      const unique_gmwk=new Set(csv_files.map(game => parseInt(game.game_week)))
      const ending_month=csv_files.find(game=>game.game_week===Math.max(...unique_gmwk)).match_date.split(' ')[1]

      const start_months= months.slice(months.indexOf(starting_month))
      const before_start_months=months.slice(0,months.indexOf(starting_month))
      const before_plus_start_months=[...start_months, ...before_start_months]

      const end_months= before_plus_start_months.slice(0,before_plus_start_months.indexOf(ending_month)+1)
      consolelog({start_months, end_months, before_start_months,before_plus_start_months, ending_month})
      
      const new_range_of_months=[...new Set([...start_months,...end_months])]
      setMonthOptions(new_range_of_months)
      setMounted(true)
      range_of_months=new_range_of_months

    }

    const filtered_data=csv_files.filter(
      ({match_date,match_period},ind)=>{


        const item_month= match_date.split(' ')[1]
        const month_pos=range_of_months.indexOf(monthFrom)
        const month_to_pos=range_of_months.indexOf(monthTo)
        const item_pos=range_of_months.indexOf(item_month)

        if(ind===1){
          consolelog({item_month, month_pos, month_to_pos, item_pos, range_of_months})
        }
        if(month_pos>=0){
          if(item_pos<month_pos) return false
        }
        if(month_to_pos>=0){
          if(item_pos>month_to_pos) return false
        }
        if(['early kick-off', 'late kick-off', 'standard kick-off'].includes(kickOffTime)){
          return match_period===kickOffTime        
        }
        return true
      }
    )
    // parseCSVFile('./public/your-file.csv')
    // consolelog({csv_files})
    return {csv:{data:filtered_data, all_data:csv_files}, body:{}}
  } 
  // const toggleOptions=(season_data)=>{
  //   if(!season_data) return {}
  //   consolelog({season_data})
  //   return season_data
  // } 

  const [options, setOptions]= useState({
    monthFrom:"Beginning",
    monthTo:"Ending", kickOffTime:"all"
  })


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
      <div className="flex items-start rounded-[27px] border shadow-lg h-[700px] relative">
        <Sidebar active={activeTab} onClick={(a)=>setActiveTab(a)}/>
        <section className=" py-2 pr-3  ml-[-3px] w-[100%]">
          <div className="bg-[#F9F9F9] pb-5 pl-[30px] pr-5 rounded-r-[27px] relative">
            <div className="sticky top-0 bg-[#F9F9F9] py-5 z-[10]">
                <h1 className="uppercase text-2xl font-bold mb-[30px]">{year} {league} SEASON STATISTICS <span className="opacity-75 text-sm lowercase">{csv?.data?.length? ' out of '+csv?.data?.length+' matches':''}</span></h1>
                <hr />
            </div>
            <section className="">
            <div className="grid grid-cols-3 gap-[10px] w-[1000px] mb-2">
              <div>
                <SelectOptionAsObjectValue
                  options={
                      (
                      monthOptions.includes(options.monthTo)?
                        monthOptions.slice(0, monthOptions.indexOf(options.monthTo)):
                        monthOptions
                      )
                      .map((month)=>({label:month,value:month}))
                    }
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
                  options={
                    (
                      monthOptions.includes(options.monthFrom)?
                        monthOptions.slice(monthOptions.indexOf(options.monthFrom)):
                        monthOptions
                    )
                    .map((month)=>({label:month,value:month}))
                  }
                  onChange={(x)=>setOptions({...options, monthTo:x.value})}
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
                    label={options.kickOffTime.split(' ')[0] || 'all'}
                    value={options.kickOffTime || 'all'}
                    leftSibling={
                      <p className="opacity-75 text-gray-500">Kick-off Time:</p>
                    }
                  />
              </div>
            </div>
            <div style={(seasonLoading && false) || (isSeasonError && false)?{justifyContent:"center"}:{}} 
              className={`min-h-[580px] flex items-center flex-col`}>
              <DataFetch 
                isLoading={false} 
                isError={false} 
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
                <div className="self-start w-full max-h-[470px] overflow-y-scroll">
                  <Chart data={csv.data} tab={activeTab} monthOptions={monthOptions}/>
                </div>
              </DataFetch>
            </div>           
            </section>
             
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
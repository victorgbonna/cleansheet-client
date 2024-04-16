import { Chart, DataFetch, SelectOptionAsObjectValue } from "@/components";
import Sidebar from "@/components/SideBar";
import { API_ENDPOINTS, consolelog} from "@/configs";
import fake from "@/configs/fakedata";
import { useHttpServices,useRouterQuery } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useEffect, useMemo, useState, useContext } from "react";
import { EnterChatContext } from "@/context";
import XLSX from "xlsx";
import { EnterChatModal, Ok } from '@/components/modal'

export default function Result() {
  const { showModal, setShowModal } = useContext(EnterChatContext);
  const {routerQuery, routerPushSolo, routerIsReady}= useRouterQuery()
  const {postData}=useHttpServices()
  const [season_not_equal, set_season_not_equal]= useState({})

  const [activeTab, setActiveTab]= useState('general')
  const getSeasonData=async()=>{    
    return await postData(API_ENDPOINTS.GET_SEASON_INFO,{
      league:routerQuery.league, 
      year:routerQuery.year.toLowerCase()
    })
  }
  const months=['January', 'February', 'March', 'April', 'May', 'June', 'August', 'September', 'October', 'November', 'December']
  const {isLoading:seasonLoading, data:season_data, error, isError:isSeasonError}= useQuery(
    {
      queryKey:['season-info:',routerQuery.league, routerQuery.year],
      queryFn:()=>getSeasonData(),
      onSettled:(data)=>{
        consolelog({finalData:data})

      },
      enabled:routerIsReady && !showModal,
      retry:false,
    }
  )

  const downloadRecordAsExcel= ({data, name}) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, name);
  };
  const [monthOptions,setMonthOptions]=useState(['Beginning','January', 'February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Ending'])
  const [mounted, setMounted]= useState(false)
  const updateData=({season_data,options})=>{
    if(!season_data?.data?.data){
      return {csv:{data:[], all_data:[]}, body:{}}
      // do codes
      // carry the first and use to update the options
    }

    // consolelog({season_data:season_data?.data?.data})
    const csv_files= season_data?.data?.data?.csv_data
    // || fake
    const body=season_data?.data?.data?.body 
    // || {}

    consolelog({csv_files})
    // calculate the total handshakes = (n*(n-1))/2
    if (body.overFilled>0){
        set_season_not_equal({
          problem:"over-complete",
          teamsInQuestion:[]
        })
    }
    if (body.overFilled<0){
      set_season_not_equal({
        problem:"in-complete",
        teamsInQuestion:body.remainingFixtures
      })
    }
    const {monthFrom, monthTo, kickOffTime}=options

    consolelog({monthTo})
    let range_of_months=monthOptions
    if(!mounted){
      consolelog(csv_files.length)
      const starting_month=csv_files[0].match_date.split(' ')[1]
      // const ending_month=csv_files?.find(({game_week})=>game_week===38)?.match_date.split(' ')[1]
      // const ending_month=Math.max(...csv_files.filter(game=>parseInt(game.game_week)).map(game => game.game_week))
      const unique_gmwk=new Set(csv_files.map(game => parseInt(game.game_week)))
      consolelog({unique_gmwk})
      const ending_month=csv_files.find(game=>parseInt(game.game_week)==Math.max(...unique_gmwk)).match_date.split(' ')[1]

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
                <div className="flex justify-between items-end mb-[30px]">
                  <h1 className="uppercase text-xl font-bold">{routerQuery.year} {routerQuery.league} STATISTICS <span className="opacity-75 text-sm lowercase">{csv?.all_data?.length? ' out of '+csv?.data?.length+' matches':''}</span></h1>
                  <div className="flex gap-x-4 text-sm">
                    <button onClick={()=>setShowModal('yes')} className="rounded-md text-white bg-blue-500 px-3 py-2">Select Another Season</button>
                    <button onClick={()=>downloadRecordAsExcel({data:csv.all_data, name:body.season+'_'+body.year+'.xlsx'})} className="rounded-md bg-green-500 text-white px-3 py-2">Download Data</button>
                    <button className="rounded-md bg-gray-200 px-3 py-2 opacity-3 text-gray-600" disabled={true}>Download Report <span className="text-xs">{'(TBA)'}</span></button>
                    
                  </div>
                </div>
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
                isLoading={seasonLoading} 
                isError={isSeasonError} 
                isEmpty={!seasonLoading && !csv?.all_data?.length} errorMsg={error?.message}
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
                  <Chart data={csv.data} tab={activeTab} monthOptions={monthOptions} season_data={{
                    league:routerQuery.league
                  }}/>
                </div>
              </DataFetch>
            </div>           
            </section>
             
          </div>
        </section>
      </div>
      <EnterChatModal onNext={(new_query)=>{
        setShowModal(false)
        routerPushSolo(new_query)
      }}/>
      {!!season_not_equal?.problem 
        &&
        <Ok 
          problemObj={season_not_equal}
          text={
            season_not_equal.problem==="over-complete"?
            <div className="flex justify-center item-center">
              <p>WARNING!! WARNING !!</p> 
              <p>You might encounter some discrepancies in the analysis as the data scraped from the source is over-populated.</p>
              <p>If you're looking for the beauty of analysis, you can pass it up.</p> 
              <p>However, if you want correct information, please be patient as our staff is currently working on them.</p>
            </div>:
           <div className="flex justify-center item-center">
            <p>WARNING!! WARNING !!</p> 
            <p>You may notice some discrepancies in the study since the data taken from the source happens to be under-populated.</p>
            <p>The involved teams that might cause this are mentioned below.</p>
            <div>
              {season_not_equal.teamsInQuestion.map((team)=>
                <p>{team}</p>
              )}
            </div>
            {/* t is highly possible that matches involving mentioned teams were not scraped properly by our scraper.  */}
            <p>Do well to be patient, our team is working on it</p>
          </div>}
          onClose={()=>set_season_not_equal({})}
        />
      }
    </main>
  );
}

// export const getServerSideProps = async (req) => {
  
//   const {league, year}=req.query
//   if(!league || !year){
//     return {
//         redirect: {
//           destination: '/',
//           permanent: false,
//         },
//       };
//   }
//   return {
//     props: {
//         league, year
//     },
//   };
// };
import { EnterChatModal } from "@/components/modal";
import { API_ENDPOINTS, consolelog } from "@/configs";
import { EnterChatContext } from "@/context";
import { useHttpServices } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import Head from "next/head";
import { useContext } from "react";
import Link from "next/link";
// import { Nunito } from 'next/font/google'

// const nunito = Nunito({
//   variable: '--font-nunito',
//   subsets:['latin']
// })
export default function Home() {
  const { showModal, setShowModal } = useContext(EnterChatContext);

  const {getData}= useHttpServices()
  const getAllSeasonsData=async()=>{    
    return await getData(API_ENDPOINTS.GET_ALL_SEASONS)
  }
  
  const {isLoading:seasonLoading, data:seasons_data, error, isError:isSeasonsError}= useQuery(
    {
      queryKey:['all-seasons'],
      queryFn:()=>getAllSeasonsData(),
      retry:false,
    }
  )
  consolelog({seasons_data, error})

  return (
    <main>
      <Head>
        <title>Football Season Stats: Goals, Cleansheets, Highlights & Performance</title>
        <meta name="description" content="Explore comprehensive stats and highlights from the football season. Discover match performances, goal-scoring tdends, and key highlights for valuable insights into the season's top moments." />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <>
      <div className="largepc:hidden pc:hidden tablet:flex justify-center">
          <p>I apologise for the inconvenience. This application is not available on mobile yet, you can only view on PC</p>
      </div>
      <div 
      // style={{backgroundImage: `}} 
        className="relative h-screen w-screen tablet:h-fit p-6 flex flex-cols items-center tablet:hidden">
        <img className="z-1 absolute inset-0 h-full w-full" 
        src="https://res.cloudinary.com/greyhairedgallery/image/upload/v1714247792/altaria_hub_uploads/ajvmfxu8s1m4qiqdrytc.jpg"
        
        />
        <div className="z-[3] relative justify-between  tablet-max-w-full flex tablet:flex-col gap-x-[80px] w-full px-[120px]">
            <div className="space-y-8">
              <h1 className={"text-white text-5xl shadow-lg "}>FootyDataScraper</h1>
              <p className={"text-white w-[350px]"}>
              Need Visual Analysis on any EPL, Seria A, La Liga Season?
              </p>
              <button onClick={()=>setShowModal('yes')} className="rounded-md border border-[#007605] text-sm font-semibold text-green px-10 py-4 text-[#007605] bg-white">Test Now</button>

            </div>
            {!seasonLoading ?<div className="py-5 rounded-md bg-white border basis-[30%]">
              {
              0?
              <div className="h-[300px] w-full">

              </div>
              :
              <div style={seasonLoading?{visibility:'hidden'}:{}}>
              <p className="text-center text-sm font-medium text-[#474747] mb-2">
                Recent Searches - {seasons_data?.data?.seasons?.length || ''}
              </p>
              <div>
                <table className=" table border-separate border-spacing-x-8 border-spacing-y-2 w-full">
                  <thead>
                    <tr className="text-sm text-center">
                      <th>League</th>
                      <th>Season</th>
                      <th className="text-left">Date</th>
                    </tr>
                  </thead>
                </table>
                <div className="w-full max-h-[300px] overflow-y-auto">
                  <table className="table border-separate border-spacing-x-8 border-spacing-y-2 w-full">
                  <tbody>
                      {seasons_data?.data?.seasons?.map(({league, year,created_at},ind)=>
                        <tr key={ind} className="text-xs text-center">
                          <td>
                            <div className="flex items-end gap-x-[2px]">
                              <img src={'/images/'+league?.replace(' ', '')?.toLowerCase()+'.svg'}/>
                              <p className="text-black font-semibold" 
                                style={
                                  league==="epl"?{textTransform:"uppercase"}:
                                    {textTransform:"capitalize"}
                                }
                                
                              >{league}</p>
                            </div>
                            
                          </td>
                          <td className="text-[#2C2C2C]">{year}</td>
                          <td className="text-left text-black font-medium">{
                            new Date(created_at).getDate() + "/" + 
                            (+new Date(created_at).getMonth()<10? '0'+(+new Date(created_at).getMonth() + 1):(+new Date(created_at).getMonth() + 1)) 
                            + "/" + new Date(created_at).getFullYear()+', '+new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                          }</td>
                        </tr>                    
                      )}
                  </tbody>
                </table>
                </div>
              </div>
              </div>
              }
            </div>:null}
        </div>

        <div className="absolute bottom-[3%] flex justify-center w-[94vw] z-[4] flex items-center ">
          <div className="flex items-center text-white font-medium text-sm w-fit">
            <p>{'Created by'}&nbsp;</p>
            <Link href="https://www.linkedin.com/in/victorgbonna/" className="font-semibold">Ogbonna Victor</Link> 
            <p>.&ensp;Need my Expertise?</p>&nbsp;
            <Link href="mailto: victorgbonna@gmail.com" className="flex items-center">
              <p className="text-[#FF3D00]">Contact me here</p>&nbsp;
              <img src="/images/envelope.svg"/>
            </Link> 
          </div>
        </div>
      </div>
      <EnterChatModal onNext={(new_query)=>{
        setShowModal(false)
        window.location.href="/season-result?league="+new_query.league+'&year='+new_query.year
        return
      }}/>
    </>
    </main>
  );
}

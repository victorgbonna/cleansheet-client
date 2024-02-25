function General({data}){
    return (
        <section className="grid grid-cols-2 gap-4 tablet:grid-cols-2">
            <div className="mb-5">
                <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-md px-3 py-2">
                        <p>Goal Scored</p>
                        
                        <p>{'222'}</p>
                        <p>{'222'} per game</p>
                    </div>
                    <div>

                    </div>
                    <div>

                    </div>

                    <div>
                        
                    </div>
                    <div>
                        
                    </div>
                    <div>
                        
                    </div>
                </div>
                <div>

                </div>
            </div>
        </section>
    )
}
export default function Chart({data, tab}){
    return(
        <>
        {   tab==="general"?
                <General data={data}/>:
                null
        }
        </>
    )

}


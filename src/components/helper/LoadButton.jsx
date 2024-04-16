export default function LoadButton({ 
    children, 
    className=""
    ,onClick, disabled=false,
    isLoading,
    loadingLabel
}){
    // const classes = `py-4 bg-primary1 px-12 rounded-lg text-white ${className}`;
    return (
      <>
          <button 
              onClick={onClick}
              disabled={disabled || isLoading}
              className={className+ ' btnTrans'}>
              {isLoading?
              
                <div className="flex justify-center w-full">
                    <img src="/svg/spinner.svg"/>
                </div>  
                :
                children
            }
          </button>
      </>
    );
  };
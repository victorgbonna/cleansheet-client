export default function ImageContainer({src, className, alt="an icon", parentColor="bg-white"}){
    return(
        <div className={className+ ' relative overflow-hidden '+parentColor}>
            <div className="shadow-md w-full h-full z-2 absolute"></div>
            <img src={src} alt={alt} className="w-full h-full absolute z-4 bg-inherit" loading="lazy"/>
        </div>
    )
}
  
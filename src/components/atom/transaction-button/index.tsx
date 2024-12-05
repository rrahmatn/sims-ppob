import React from 'react'
import { Link } from 'react-router-dom'

interface TransactionButtonProps {
  text : string,
  to : string,
  img : string,
  onClick : ()=>void
}

export const TransactionButton : React.FC<TransactionButtonProps> = ({text, to,img , onClick}) => {
  return (
    <Link to={to} onClick={onClick} className="w-20 h-20 flex flex-col gap-1 text-center cursor-pointer group">
        <figure className='w-14 h-14 grid  place-items-center mx-auto rounded-lg shadow-md group-hover:border-2 group-hover:borde-black '>
            <img className='w-full h-full' src={img} alt="Service icon" />
        </figure>
        <p className='font-semibold text-center text-xs group-hover:animate-bounce duration-300'>{text}</p>
    </Link>
  )
}


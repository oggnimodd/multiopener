import tw, { styled } from 'twin.macro';

export const SearchBoxContainer = styled.div`
  ${tw`
    flex 
    flex-col
    items-center 
    w-full 
    h-full 
    fixed 
    top-0 
    left-0 
    z-[99999] 
  `}
`;

export const Overlay = styled.div`
  ${tw`
    z-[99998] 
    w-full 
    h-full
    top-0 
    left-0  
    fixed 
  `}
  background : rgba(0,0,0,.7);
`;

export const SearchArea = styled.div`
  ${tw`
      min-w-[600px]
      mt-24  
  `}
`;

export const WebsiteList = styled.ul`
  ${tw`
    w-full 
    flex  
    flex-wrap 
    justify-between 
    gap-y-5
  `}

  li{
    width : calc((100% - 2rem) / 3);
  }
`;

export const TypeTitle = styled.h3`
  ${tw`
    text-2xl
    mt-3 
    text-white
    mb-2
  `}
`;

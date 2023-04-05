import { refs } from "./refs";
export default function infinityScroll() {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      console.log("entry.target ",entry.target);
      console.log("entry.isIntersecting ",entry.isIntersecting);
      if (entry.intersecting && apiService.totalHits > 0) {
           refs.btnLoadMore.classList.add('is-hidden');
          moreLoad();
      }
    }
  }, {rootMargin:"400px"} //  коли від viewport 400px до btnLoadMore
  )
  observer.observe(refs.btnLoadMore);
 
};
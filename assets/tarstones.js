(() => {
 const search=document.querySelector('#tarstone-search'), target=document.querySelector('#tarstone-target'), category=document.querySelector('#tarstone-category');
 const cards=[...document.querySelectorAll('.tarstone-card')];
 function filter(){let shown=0;const query=search.value.trim().toLowerCase();cards.forEach(card=>{const visible=(!query||card.textContent.toLowerCase().includes(query))&&(!target.value||card.dataset.target===target.value)&&(!category.value||card.dataset.category===category.value);card.hidden=!visible;if(visible)shown++;});document.querySelector('#tarstone-count').textContent=`${shown} of ${cards.length} entries`;document.querySelector('#tarstone-empty').hidden=shown!==0;}
 search.addEventListener('input',filter);target.addEventListener('change',filter);category.addEventListener('change',filter);
})();

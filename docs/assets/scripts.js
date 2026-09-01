// Dialog
const openDialog = (id) => {
   const dialog = document.querySelector(`#${id}`);
   if (!dialog) return;
   dialog.style.display = 'flex';
   dialog.classList.add('active');
   setTimeout(() => {
      dialog.style.opacity = '1';
   }, 0);
}
const closeDialog = (id) => {
   const dialog = document.querySelector(`#${id}`);
   if (!dialog) return;
   dialog.style.opacity = '0';
   dialog.classList.remove('active');
   setTimeout(() => {
      dialog.style.display = 'none';
   }, 200);
}
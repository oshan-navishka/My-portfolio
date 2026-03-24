document.getElementById('cvBtn').addEventListener('click', function() {
    const btnText = this.querySelector('.btn-text');
    this.classList.add('downloading');
    btnText.textContent = 'Downloading...';
    setTimeout(() => {
        this.classList.remove('downloading');
        btnText.textContent = 'Download CV';
    }, 2000);
});
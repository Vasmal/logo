$(function() {
	$('.icon-menu').on("click", function(){
		$(this).toggleClass('active');
		$('.menu__body').toggleClass('active');
		$('body').toggleClass('stopscroll');
	});

	function ibg(){
		$.each($('.ibg'), function(index, val) {
			if($(this).find('img').length>0){
			$(this).css('background-image','url("'+$(this).find('img').attr('src')+'")');
			}
		});
	}
	ibg();
	/*
	$('form').on('click', 'button:not([type="submit"])', function(e){
		e.preventDefault();
	 })
	 */
	// Dynamic Adapt v.1
	// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
	// e.x. data-da=".item,992,2"
	// Andrikanych Yevhen 2020
	// https://www.youtube.com/c/freelancerlifestyle

	"use strict";

	function DynamicAdapt(type) {
		this.type = type;
	}

	DynamicAdapt.prototype.init = function () {
		const _this = this;
		// массив объектов
		this.оbjects = [];
		this.daClassname = "_dynamic_adapt_";
		// массив DOM-элементов
		this.nodes = document.querySelectorAll("[data-da]");

		// наполнение оbjects объктами
		for (let i = 0; i < this.nodes.length; i++) {
			const node = this.nodes[i];
			const data = node.dataset.da.trim();
			const dataArray = data.split(",");
			const оbject = {};
			оbject.element = node;
			оbject.parent = node.parentNode;
			оbject.destination = document.querySelector(dataArray[0].trim());
			оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
			оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.оbjects.push(оbject);
		}

		this.arraySort(this.оbjects);

		// массив уникальных медиа-запросов
		this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
			return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
		}, this);
		this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
			return Array.prototype.indexOf.call(self, item) === index;
		});

		// навешивание слушателя на медиа-запрос
		// и вызов обработчика при первом запуске
		for (let i = 0; i < this.mediaQueries.length; i++) {
			const media = this.mediaQueries[i];
			const mediaSplit = String.prototype.split.call(media, ',');
			const matchMedia = window.matchMedia(mediaSplit[0]);
			const mediaBreakpoint = mediaSplit[1];

			// массив объектов с подходящим брейкпоинтом
			const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
				return item.breakpoint === mediaBreakpoint;
			});
			matchMedia.addListener(function () {
				_this.mediaHandler(matchMedia, оbjectsFilter);
			});
			this.mediaHandler(matchMedia, оbjectsFilter);
		}
	};

	DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
		if (matchMedia.matches) {
			for (let i = 0; i < оbjects.length; i++) {
				const оbject = оbjects[i];
				оbject.index = this.indexInParent(оbject.parent, оbject.element);
				this.moveTo(оbject.place, оbject.element, оbject.destination);
			}
		} else {
			for (let i = 0; i < оbjects.length; i++) {
				const оbject = оbjects[i];
				if (оbject.element.classList.contains(this.daClassname)) {
					this.moveBack(оbject.parent, оbject.element, оbject.index);
				}
			}
		}
	};

	// Функция перемещения
	DynamicAdapt.prototype.moveTo = function (place, element, destination) {
		element.classList.add(this.daClassname);
		if (place === 'last' || place >= destination.children.length) {
			destination.insertAdjacentElement('beforeend', element);
			return;
		}
		if (place === 'first') {
			destination.insertAdjacentElement('afterbegin', element);
			return;
		}
		destination.children[place].insertAdjacentElement('beforebegin', element);
	}

	// Функция возврата
	DynamicAdapt.prototype.moveBack = function (parent, element, index) {
		element.classList.remove(this.daClassname);
		if (parent.children[index] !== undefined) {
			parent.children[index].insertAdjacentElement('beforebegin', element);
		} else {
			parent.insertAdjacentElement('beforeend', element);
		}
	}

	// Функция получения индекса внутри родителя
	DynamicAdapt.prototype.indexInParent = function (parent, element) {
		const array = Array.prototype.slice.call(parent.children);
		return Array.prototype.indexOf.call(array, element);
	};

	// Функция сортировки массива по breakpoint и place 
	// по возрастанию для this.type = min
	// по убыванию для this.type = max
	DynamicAdapt.prototype.arraySort = function (arr) {
		if (this.type === "min") {
			Array.prototype.sort.call(arr, function (a, b) {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}

					if (a.place === "first" || b.place === "last") {
						return -1;
					}

					if (a.place === "last" || b.place === "first") {
						return 1;
					}

					return a.place - b.place;
				}

				return a.breakpoint - b.breakpoint;
			});
		} else {
			Array.prototype.sort.call(arr, function (a, b) {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}

					if (a.place === "first" || b.place === "last") {
						return 1;
					}

					if (a.place === "last" || b.place === "first") {
						return -1;
					}

					return b.place - a.place;
				}

				return b.breakpoint - a.breakpoint;
			});
			return;
		}
	};

	const da = new DynamicAdapt("max");
	da.init();

////////////////////////////////////////////////////////////////

	$(".menu-page__icon").on('click', function() {
		$(this).toggleClass('active');
		$('.menu-page__body').toggleClass('close');
	});

	$(".menu-page__link").on('click', function() {
		//e.preventDefault();
		if ($(window).width() < 991) {
			if ($(".menu-page__link").hasClass('active')) {
				$(".menu-page__link").removeClass('active');
				$(".menu-page__parent").removeClass('active');
			} else {
				$(this).toggleClass('active');
				$(this).parent().toggleClass('active');
			}
			
		}
	});

	$('.search-page__title').on('click', function() {
		$('.categories-search').slideToggle();
		$(this).toggleClass('active');
	});

	$('.categories-search__checkbox').on('click', function() {
		let checked = $('.categories-search__checkbox input:checked').length;
		
		if (checked > 0) {
			$('.search-page__title span').text("Выбрано: " + checked);
		} else {
			$('.search-page__title span').text("Везде");
		}
	});

	if ($('.mainslider__body').length) {
		$('.mainslider__body').slick({
			arrows: false,
			dots: true,
			infinite: false,
		});
		let mainsliderImages = $('.mainslider__image');
		let mainsliderDots = $('.mainslider__body .slick-dots button');
		let mainsliderDotsImage = mainsliderDots.append('<span class="slick-dots__image"></span>');

		$('.slick-dots__image').addClass('ibg');
		let i = 0;
		let mainsliderImage;
		$.each($('.slick-dots__image'), function(index, val) {
			for ( ; i < mainsliderImages.length; ) {
				mainsliderImage = mainsliderImages[i];
				i++;
				break;
			}
			$(this).css('background-image','url("'+$(mainsliderImage).find('img').attr('src')+'")');
		});
	}

	if ($('.page__products').hasClass('products-slider')) {
		$('.items-products').slick({
			//mobileFirst: true,
			prevArrow = '.products-slider__control--prev',
			nextArrow = '.products-slider__control--next',
			infinite: false,
			rows: 2,
			slidesPerRow: 3,
			responsive: [
				{
					breakpoint: 1170,
					settings: {
						rows: 2,
						slidesPerRow: 2,
					}
				},
				{
					breakpoint: 992,
					settings: {
						rows: 2,
						slidesPerRow: 3,
					}
				},
				{
					breakpoint: 840,
					settings: {
						rows: 2,
						slidesPerRow: 2,
					}
				},
				{
					breakpoint: 600,
					settings: {
						rows: 2,
						slidesPerRow: 1,
					}
				},
			]
		});

		$('.items-products__column').removeAttr('style');

		let currentSlide = $('.items-products').slick('slickCurrentSlide');
		$('.number-products__current').text(currentSlide + 1);
		$('.items-products').on('afterChange', function(event, slick, currentSlide) {
			$('.number-products__current').text(currentSlide + 1);
		});
		let slidesNum = $('.items-products .slick-slide').length;
		$('.number-products__total').text(slidesNum);

	}

	if ($('.brands-slider').length) {
		$('.brands-slider__body').slick({
			prevArrow = '.controls-brands__prev',
			nextArrow = '.controls-brands__next',
			slidesToShow: 5,
			slidesToScroll: 5,
			variableWitdh: true,
			responsive: [
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 4,
						slidesToScroll: 4,
					}
				},
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3,
					}
				},
				{
					breakpoint: 640 ,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2,
					}
				},
			]
		});
	}

	//range slider/////////////////////////////////////////////////
	
	if ($('.filter').length) {
		$('.filter-price__range').slider({
			animate: 'slow',
			min: 0,
			max: 200000,
			range: true,
			step: 1,
			values: [0, 100000],
			slide : function(event, ui) {
				$('.filter-price__input-min').val(ui.values[0]);
				$('.filter-price__input-max').val(ui.values[1]);
				$('.ui-slider-handle__num-min').text(ui.values[0]);
				$('.ui-slider-handle__num-max').text(ui.values[1]);
		  }
		});
		$('.ui-slider-handle').html('<span class="ui-slider-handle__num"></span>');
		$('.ui-slider-handle__num').first().addClass('ui-slider-handle__num-min');
		$('.ui-slider-handle__num').last().addClass('ui-slider-handle__num-max');
		
		$('.ui-slider-handle__num-min').text($(".filter-price__range").slider("values", 0));
		$('.ui-slider-handle__num-max').text($(".filter-price__range").slider("values", 1));
		$('.filter-price__input-min').val($(".filter-price__range").slider("values", 0));
		$('.filter-price__input-max').val($(".filter-price__range").slider("values", 1));

		$('.filter-price__range').on( "slidechange", function( event, ui ) {
			$('.ui-slider-handle__num-min').text($(".filter-price__range").slider("values", 0));
			$('.ui-slider-handle__num-max').text($(".filter-price__range").slider("values", 1));
			$('.filter-price__input-min').val($(".filter-price__range").slider("values", 0));
			$('.filter-price__input-max').val($(".filter-price__range").slider("values", 1));
			let valueMin = $('.filter-price__input-min').val();
			let valueMax = $('.filter-price__input-max').val();
		});

		$('.filter-price__input').on("change", function() {
			let valueMin = $('.filter-price__input-min').val();
			let valueMax = $('.filter-price__input-max').val();
			$('.filter-price__range').slider("values", [valueMin, valueMax]);
		});
		
		$('.section-filter__title.spoller').on("click", function() {
			$(this).toggleClass('active');
			let spollerParent = $(this).parent();
			spollerParent.children('.spoller-content').slideToggle();
		});
		/*
		let inputChecked = $('.checkbox__input:checked').parent();
		inputChecked.children('.checkbox__text').addClass('active');

		$('.checkbox__text').on("click", function() {
			$(this).toggleClass('active');
			
		});
		*/

		/*
		$('.actions-filter__button--clear').on("click", function() {
			$('.checkbox__input').prop('checked', false);
		});
		*/

		$('.filter__title').on('click', function() {
			if($(window).width() < '992') {
				$('.filter__content').slideToggle('slow', 'linear');
			}
		});
	}

	if ($('.gallery-product').length) {
		$('.mainslider-gallery').slick({
			slidesToShow: 1,
			arrows: false,
			asNavFor: '.subslider-gallery',
		});

		$('.subslider-gallery').slick({
			slidesToShow: 4,
			slidesToScroll: 4,
			infinite: false,
			arrows: false,
			asNavFor: '.mainslider-gallery',
			focusOnSelect: true,
		});
	}
	
	$('.tabs-item').on('click', function(e) {
		e.preventDefault();
		$('.tabs-item').removeClass('active');
		$(this).addClass('active');
		$('.tabs-block').removeClass('active');
		$('.tabs-block').eq($(this).index()).addClass('active');
	});

	function req() {
		$('input.form-block__input').prop('required', true);
		$('.form-block__input:required').parent().children('.form-block__label').append('<span class="star"> *</span>');
	}
	req();
});

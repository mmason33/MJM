

<?php if( have_rows('text_box')): ?>
	<div class="slider-pro" id="my-slider">
		<div class="sp-slides">
	<?php while ( have_rows('text_box') ) : the_row(); ?>

			<div class="sp-slide">
				<div class="text-center slide-wrap">
					<?php echo get_sub_field('text_area'); ?>
				</div>
			</div>

	<?php endwhile; ?>
		</div>
	</div>
<?php endif; ?>



<!-- 
<section class="text-box">
	<div class="text-box--area">
			<?php //echo $content; ?>
	</div>
</section> -->
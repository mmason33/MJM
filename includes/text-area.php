

<?php if( have_rows('text_box')): ?>
	<div class="slider-pro" id="my-slider" data-aos="zoom-in" data-aos-once="true">
		<div class="sp-slides">
<?php $i = 1; ?>
	<?php while ( have_rows('text_box') ) : the_row(); ?>

			<div class="sp-slide">
				<div id="<?php echo $i; ?>" class="text-center slide-wrap">
					<?php echo get_sub_field('text_area'); ?>
				</div>
			</div>
	<?php $i++; ?>
	<?php endwhile; ?>
		</div>
	</div>

<?php else: ?>
	
<?php endif; ?>



<!-- 
<section class="text-box">
	<div class="text-box--area">
			<?php //echo $content; ?>
	</div>
</section> -->
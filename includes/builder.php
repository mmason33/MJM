<?php //check if the flexible content field has rows
	if( have_rows('builder') ):
		//loop through the data
		while (have_rows('builder')) : the_row();



			/************ Text Area ***************/

			if( get_row_layout() == 'text_area'):
				require('text-area.php');
			endif;


		endwhile;
	else :
		//no layouts found
	endif;
?>

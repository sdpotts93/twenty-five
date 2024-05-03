deploy:
	aws s3 cp . s3://twenty-five-code --recursive --metadata-directive REPLACE --cache-control max-age=86400 --exclude 'ssh:/*' --exclude '.gitignore' --exclude '.git/*' --profile steventwentyfive

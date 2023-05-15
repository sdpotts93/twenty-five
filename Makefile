deploy:
	aws s3 cp . s3://custom-wf-code/twenty-five/ --recursive --metadata-directive REPLACE --cache-control max-age=86400 --exclude 'ssh:/*' --exclude '.gitignore' --exclude '.git/*' --profile twentyfive

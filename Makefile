include .makefiles/ludicrous.mk
include .makefiles/docker-compose.mk


shell:
	docker-compose exec build /bin/sh || docker-compose run build /bin/sh


package:
	docker-compose run package

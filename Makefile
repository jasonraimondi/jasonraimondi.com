.PHONY: serve

default: serve

serve:
	hugo serve -D --disableFastRender --bind 0.0.0.0

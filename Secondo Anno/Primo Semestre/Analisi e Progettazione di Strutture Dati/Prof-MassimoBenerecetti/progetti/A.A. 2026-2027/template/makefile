# Compiler and JUnit bundled with the assignment
JavaC  = javac
JavaVM = java
JUnitC = ./zapsdtest/zjunit/junit-platform-console-standalone-1.12.1.jar
JUnitL = ./zapsdtest/zjunit/*

APSDSrc = $(shell find apsd -name "*.java")
TestSrc = $(shell find zapsdtest -name "*.java")
SupportSrc = $(shell find apsd/classes/utilities apsd/interfaces/traits -name "*.java")

.PHONY: all support main run test clean runtest runtestsimp runtestseq \
	runtestdeq runtestcol runtestfull runtestfullseq runtestfulldeq \
	runtestfullcol runtestfullccol runtestfullacol runtestexer

all: main

support:
	$(JavaC) -cp . $(SupportSrc)

main:
	$(JavaC) -Xlint:unchecked -cp . $(APSDSrc) Main.java

run: main
	$(JavaVM) -cp . Main

test:
	$(JavaC) -Xlint:unchecked -cp .:$(JUnitL) $(APSDSrc) $(TestSrc)

clean:
	clear; find . -name "*.class" -type f -exec rm -v {} \;

runtest: test
	$(JavaVM) -jar $(JUnitC) execute --details tree --class-path . \
	  --scan-class-path

runtestsimp: test
	$(JavaVM) -jar $(JUnitC) execute --details tree --class-path . \
	  --select-package zapsdtest.simpletest

runtestseq: test
	$(JavaVM) -jar $(JUnitC) execute --details tree --class-path . \
	  --select-package zapsdtest.simpletest.apsd.classes.containers.sequences

runtestdeq: test
	$(JavaVM) -jar $(JUnitC) execute --details tree --class-path . \
	  --select-package zapsdtest.simpletest.apsd.classes.containers.deqs

runtestcol: test
	$(JavaVM) -jar $(JUnitC) execute --details tree --class-path . \
	  --select-package zapsdtest.simpletest.apsd.classes.containers.collections

runtestfull: test
	$(JavaVM) -jar $(JUnitC) execute --details tree --class-path . \
	  --select-package zapsdtest.fulltest

runtestfullseq: test
	$(JavaVM) -jar $(JUnitC) execute --details tree --class-path . \
	  --select-package zapsdtest.fulltest.apsd.classes.containers.sequences

runtestfulldeq: test
	$(JavaVM) -jar $(JUnitC) execute --details tree --class-path . \
	  --select-package zapsdtest.fulltest.apsd.classes.containers.deqs

runtestfullcol: test
	$(JavaVM) -jar $(JUnitC) execute --details tree --class-path . \
	  --select-package zapsdtest.fulltest.apsd.classes.containers.collections

runtestfullccol: test
	$(JavaVM) -jar $(JUnitC) execute --details tree --class-path . \
	  --select-package zapsdtest.fulltest.apsd.classes.containers.collections.concretecollections

runtestfullacol: test
	$(JavaVM) -jar $(JUnitC) execute --details tree --class-path . \
	  --select-package zapsdtest.fulltest.apsd.classes.containers.collections.abstractcollections

runtestexer: test
	$(JavaVM) -jar $(JUnitC) execute --details tree --class-path . \
	  --select-package zapsdtest.simpletest.apsd.classes.exercises

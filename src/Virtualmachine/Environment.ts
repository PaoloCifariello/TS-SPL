export class Environment {
    private env: { [name: string]: Object }[] = [{}];

    public get EnvironmentAssociation(): { [name: string]: Object } {
        return this.env[this.env.length - 1];
    }

    public PushEnvironment() {
        this.env.push({});
    }

    public PopEnvironment() {
        if (this.env.length > 1)
            this.env.splice(this.env.length - 1, 1);
    }

    /**
     *	When push something on top of the Environment stack
     *	var $identifier = ...;
     *
     */
    public Declcare(variable: string, value: Object): Object {
        var old = null;
        var ev = this.EnvironmentAssociation;

        if (ev[variable])
            old = ev[variable];

        ev[variable] = value;

        return old;
    }

    /**
     *	When modify something or declare some global variable
     * 	$identifier = ...;
     *
     */
    public Modify(variable: string, value: Object) {
        var old = null,
            found = false;

        for (var i = this.env.length - 1; i >= 0; i--) {
            var current = this.env[i];
            if (current[variable]) {
                old = current[variable];
                current[variable] = value;
                found = true;
                break;
            }
        }

        if (!found)
            this.env[0][variable] = value;
    }

    public Get(variable: string): Object {
        for (var i = this.env.length - 1; i >= 0; i--)
            if (this.env[i][variable])
                return this.env[i][variable];


        if (variable == "this") {


        }

        return null;
    }
}

export class AssignmentAlreadyExists
{
}